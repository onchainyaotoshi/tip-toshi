import { Button, FrameContext, FrameResponse, TextInput } from "frog"
import { type TypedResponse } from "../../node_modules/frog/types/response.js";

import Account from '../components/account'

export default (c: FrameContext, data: Record<string,any>): TypedResponse<FrameResponse> => c.res({
    action: "/",
    image: Account(c,data),
    intents: [
      <TextInput placeholder="Amount (Toshi)" />,
      <Button.Transaction target="/topup">Topup</Button.Transaction>,
      <Button.Link href={`https://base.blockscout.com/address/${data.address}?tab=tokens`}>BaseScan</Button.Link>,
      <Button value="transaction">History</Button>,
      <Button.Reset>Go Back</Button.Reset>
    ],
});