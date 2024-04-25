import { FrameContext } from "frog";

export default (c: FrameContext, data: Record<string,any>): JSX.Element => (<div
  style={{
    alignItems: 'center',
    background: '#344afb',
    backgroundSize: '100% 100%',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    height: '100%',
    justifyContent: 'center',
    textAlign: 'center',
    width: '100%',
  }}
>
  
  <div
    style={{
      color: 'white',
      fontSize: 30,
      fontStyle: 'normal',
      letterSpacing: '-0.025em',
      lineHeight: 1.4,
      marginTop: 30,
      padding: '0 120px',
      whiteSpace: 'pre-wrap',
      marginLeft:64
    }}
  >
    {`Please send TOSHI to your smart account address to start giving tips:
    ${data.address}
    Your current balance of toshi is: ${data.balance}
    Note:
    1. Tips go to the cast's verified address; ensure your Farcaster account is connected to receive them.
    2. For now, ETH gas fees for tips are sponsored; no need to send ETH to your account.
    3. Top up your smart wallet directly by clicking 'Topup' (Max. 250k $toshi) or use 'Basescan' to copy your address and send manually.
    `}
  </div>
</div>)