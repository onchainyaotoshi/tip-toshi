import { Button, FrameContext, FrameResponse } from "frog"
import { type TypedResponse } from "../../node_modules/frog/types/response.js";

export default (c: FrameContext, a?: string): TypedResponse<FrameResponse> => c.res({
    browserLocation: '/',
    action: a ? a : undefined,
    image: `${process.env.FC_DOMAIN}/images/tip.png`,
    intents: [
        <Button.AddCastAction
        action="/tip"
        name="Tip"
        icon="gift"
      >
        Install
      </Button.AddCastAction>,
    ],
});