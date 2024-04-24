import { getFrogApp} from '../utils/app'

import SetupController from '../controllers/setup'

export const app = getFrogApp({
  initialState: {
    fid: undefined,
    walletIndex: undefined,
    tipLevel: undefined
  }
});

app.frame('/:id?', async (c) => {
  const { buttonValue, frameData, inputText, deriveState } = c;
  const fid = frameData?.fid;
  const { id } = c.req.param() as { id: string };

  console.log("id",id);

  const state = await deriveState((previousState: any) => {
    previousState.fid = fid;
  });
  
  return SetupController(c);
})