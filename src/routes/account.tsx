import { getFrogApp} from '../utils/app'

import AccountController from '../controllers/account'
import ErrorController from '../controllers/error'

import {getAccountAddress, getBalanceOf, ABI,CA} from '../utils/web3/wallet';

export const app = getFrogApp();

app.frame('/:id?', async (c) => {
  const { buttonValue, frameData, inputText, deriveState } = c;
  const fid = frameData?.fid;
  const { id } = c.req.param() as { id: string };
  
  const data = {
    address: await getAccountAddress(fid!),
    balance: await getBalanceOf(fid!),
  };
  
  return AccountController(c, data);
})

