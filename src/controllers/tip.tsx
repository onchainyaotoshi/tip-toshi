import { Button, FrameContext, FrameResponse } from "frog"
import { type TypedResponse } from "../../node_modules/frog/types/response.js";

const ADD_URL =
  `https://warpcast.com/~/add-cast-action?url=${process.env.FC_DOMAIN}/tip`;

export default (c: FrameContext, a?: string): TypedResponse<FrameResponse> => c.res({
    action: "/",
    image: `${process.env.FC_DOMAIN}/images/main.png?v=1`,
    intents: [
      //   <Button.AddCastAction
      //   action="/tip"
      //   name="$1 TOSHI Tip"
      //   description="Send a $1 PowerTip with $TOSHI"
      //   icon="gift"
      //   aboutUrl="https://poll.cool"
      // >
      //   Install
      // </Button.AddCastAction>,

      <Button.Link href={ADD_URL}>Install</Button.Link>,
      <Button value={"account"}>Account</Button>
    ],
});