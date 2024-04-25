import { Button, FrameContext, FrameResponse, TextInput } from "frog"
import { type TypedResponse } from "../../node_modules/frog/types/response.js";

import Transaction from '../components/transaction'

export default (c: FrameContext, data: Record<string,any>): TypedResponse<FrameResponse> => c.res({
    action: "/",
    image: Transaction(c,data),
    intents: [
      <Button.Reset>Go Back</Button.Reset>
    ],
});