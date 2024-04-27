import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { getFrogApp, neynar, publishCast } from "./utils/app";
import TipController from "./controllers/tip";
import AccountController from "./controllers/account";
import TransactionController from "./controllers/transaction";

import {
  getBalanceOf,
  getAmountTip,
  ABI,
  CA,
  tippingFeature,
  getAccountAddress,
} from "./utils/web3/wallet";

import TipModel from "./models/tip";

import { parseEther } from "frog";

import { CastParamType } from "@neynar/nodejs-sdk";

export const app = getFrogApp({
  browserLocation: "https://poll.cool",
});

app.use("/*", serveStatic({ root: "./public" }));

app.frame("/", async (c) => {
  const { buttonValue, frameData } = c;

  const fid = frameData?.fid;

  if (buttonValue == "account") {
    const data = {
      address: await getAccountAddress(fid!),
      balance: await getBalanceOf(fid!),
    };

    return AccountController(c, data);
  } else if (buttonValue == "transaction") {
    return TransactionController(c, {
      data: await TipModel.getLast5Transactions(fid),
    });
  }

  return TipController(c, "/");
});

app.transaction("/topup", async (c) => {
  try {
    const { inputText, frameData } = c;
    const fid = frameData?.fid;

    let amountTopup = parseInt(inputText);
    if (isNaN(amountTopup)) {
      return new Response("Invalid input value", { status: 400 });
    }

    if (amountTopup > 250000) {
      return new Response("Amount must be less than 250000 $TOSHI", {
        status: 400,
      });
    }

    // Contract transaction response.
    return c.contract({
      abi: ABI,
      chainId: "eip155:8453",
      functionName: "transfer",
      args: [await getAccountAddress(fid), parseEther(amountTopup + "", "wei")],
      to: CA,
    });
  } catch (err) {
    return new Response(err.message, { status: 400 });
  }
});

app.hono.get("/tip", async (c) => {
  let name = "Tip 😺 ($TOSHI)";

  if (process.env.FC_DOMAIN.includes("-dev")) {
    name += "-dev";
  }

  return c.json({
    name,
    icon: "gift",
    description: "Send tip with $TOSHI.",
    aboutUrl: "https://poll.cool",
    action: {
      type: "post",
    },
  });
});

app.hono.post("/tip", async (c) => {
  const {
    trustedData: { messageBytes },
  } = await c.req.json();

  const result = await neynar.validateFrameAction(messageBytes);
  if (!result.valid) {
    console.log("validate-frame-action failed");
    return c.json({ message: "Unauthorized" }, 401);
  }

  const cast = await neynar.lookUpCastByHashOrWarpcastUrl(
    result.action.cast.hash,
    CastParamType.Hash,
  );
  const {
    cast: {
      author: { fid, username },
    },
  } = cast;

  const fromFid = result.action.interactor.fid;
  const toFid = fid;
  // console.log('interactor fid: ', result.action.interactor.fid);
  // console.log('cast fid: ', fid);
  // console.log('cast username: ', username);
  if (result.action.interactor.fid === fid) {
    return c.json({ message: "Can't tip yourself!" }, 401);
  }

  try {
    if (await TipModel.exists(fromFid, result.action.cast.hash)) {
      return c.json({ message: `Double tips detected!` }, 401);
    }

    const balance = await getBalanceOf(fromFid);
    const amount = await getAmountTip();
    if (balance < amount) {
      return c.json({ message: `Insufficient balance.` }, 401);
    }

    const id = await TipModel.insert({
      fromFid: fromFid,
      toFid: toFid,
      tx: "0x",
      hash: result.action.cast.hash,
      username: username,
    });

    // console.log("id: ", id);

    // Execute tipping and insertion in the background
    process.nextTick(async () => {
      try {
        const tx = await tippingFeature(fromFid, toFid, amount);

        await TipModel.updateTxById(id, tx);

        await publishCast(
          `@${result.action.interactor.username} tipped ${amount} /toshi to @${username}`,
        )
      } catch (err) {
        console.log("Background error:", err);
      }
    });

    let message = `Tip successfully given to ${username}`;

    return c.json(
      { message: message.length > 30 ? `Tip Success (${id})` : message },
      200,
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return c.json({ message: err.message === undefined ? "error code: 818" : err.message }, 401);
  }
});

const port: number | undefined = process.env.PORT
  ? +process.env.PORT
  : undefined;

serve({
  fetch: app.fetch,
  port,
});

console.log(`Server is running on port ${port}`);
