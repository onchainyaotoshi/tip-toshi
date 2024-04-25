import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { devtools } from 'frog/dev'
import { getFrogApp, neynar } from './utils/app'

import { isLive } from './utils/dev-tools'

import TipController from './controllers/tip'
import AccountController from './controllers/account'
import TransactionController from './controllers/transaction'

import {getBalanceOf,getAmountTip, ABI, CA, tippingFeature, getAccountAddress} from './utils/web3/wallet';

import TipModel from './models/tip'

import {parseEther} from 'frog';


import { CastParamType } from "@neynar/nodejs-sdk";

export const app = getFrogApp({
  browserLocation: 'https://poll.cool',
});

app.use('/*', serveStatic({ root: './public' }))

app.frame("/", async (c)=>{
  const { buttonValue, frameData } = c;

  const fid = frameData?.fid;
  
  if(buttonValue == 'account'){
    const data = {
      address: await getAccountAddress(fid!),
      balance: await getBalanceOf(fid!),
    };

    return AccountController(c, data);
  }else if(buttonValue == 'transaction'){
    return TransactionController(c, {
      data: await TipModel.getLast5Transactions(fid),
    })
  }
  
  return TipController(c,"/");
});

app.transaction(
  '/topup',
  async (c) => {
    try{
      const { inputText , frameData} = c
      const fid = frameData?.fid;

      let amountTopup = parseInt(inputText);
      if(isNaN(amountTopup)){
        return new Response('Invalid input value', { status: 400 })
      }

      if(amountTopup > 250000){
        return new Response('Amount must be less than 250000 $TOSHI', { status: 400 })
      }

      // Contract transaction response.
      return c.contract({
        abi:ABI,
        chainId: 'eip155:8453',
        functionName: 'transfer',
        args: [await getAccountAddress(fid), parseEther(amountTopup+"", "wei")],
        to: CA
      });
    }catch(err){
      return new Response(err.message, { status: 400 })
    }
  }
)

app.hono.get("/tip", async (c) => {
  return c.json({
    name: "Tip 😺 ($TOSHI)",
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
  if (result.valid) {
    const cast = await neynar.lookUpCastByHashOrWarpcastUrl(
      result.action.cast.hash,
      CastParamType.Hash
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

    try{
      if(await TipModel.exists(fromFid,result.action.cast.hash)){
        return c.json({ message: `You've already given tips.` }, 401);
      }

      const balance = await getBalanceOf(fromFid);
      const amount = await getAmountTip();
      if(balance < amount){
        return c.json({ message: `Insufficient balance.` }, 401);
      }

      const tx = await tippingFeature(fromFid, toFid,amount);
      console.log("tx:",tx);
      await TipModel.insert({
        fromFid: fromFid,
        toFid: toFid,
        tx: tx,
        hash: result.action.cast.hash,
        username:username
      });

      console.log('tip success');
      
      return c.json({ message: `Tip given.`}, 200);
    }catch(err){
      console.log('error2',err);
      return c.json({ message: err.message }, 401);
    }
  } else {
    console.log('validate-frame-action failed');
    return c.json({ message: "Unauthorized" }, 401);
  }
});

// this code is commented since frog 0.8.6 not support deeplink v2 yet
// app.castAction('/tip', async (c) => {
//   try{
//     if(!c.verified){
//       return c.res({
//           message: `action not verified.`,
//           statusCode: 400
//       });
//     }
    
//     if(await TipModel.exists(c.actionData.fid,c.actionData.castId.hash)){
//       return c.res({
//           message: `You've already given tips.`,
//           statusCode: 400
//       });
//     }
    
//     const balance = await getBalanceOf(c.actionData.fid);
//     const amount = await getAmountTip();
//     // console.log('balance:',balance,',amount:',amount,',balance < amount:',balance<amount);
//     if(balance < amount){
//       return c.res({
//           message: `Insufficient balance.`,
//           statusCode: 400
//       })
//     }

//     const tx = await tippingFeature(c.actionData.fid, c.actionData.castId.fid,amount);
//     const id = await TipModel.insert({
//       fromFid: c.actionData.fid,
//       toFid: c.actionData.castId.fid,
//       tx: tx,
//       hash: c.actionData.castId.hash
//     });
    
//     return c.res({ message: `Tips (${id}) successfully given.`,statusCode:200 });
//   }catch(err){
//     return c.res({message: err.message,statusCode: 400 });
//   }
// })

const port: number | undefined = process.env.PORT ? +process.env.PORT : undefined;

// if(!isLive()){
//   devtools(app, { serveStatic })
// }

serve({
  fetch: app.fetch,
  port,
})

console.log(`Server is running on port ${port}`)