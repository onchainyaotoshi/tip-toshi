import { Button, FrameContext, FrameResponse, TextInput } from "frog"
import { type TypedResponse } from "../../node_modules/frog/types/response.js";

import Style1 from '../components/style-1'

export default (c: FrameContext, a?: string): TypedResponse<FrameResponse> => c.res({
    action: a ? a : undefined,
    image: Style1(c,'test'),
    intents: [
      <TextInput placeholder={""}/>,
      <Button.Reset>Go Back</Button.Reset>
    ],
});