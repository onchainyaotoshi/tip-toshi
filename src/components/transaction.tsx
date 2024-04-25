import { FrameContext } from "frog";

export default (c: FrameContext, opts: Record<string,any>): JSX.Element => (<div
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
    color: 'white',
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
    {`Last 5 Given Tips:`}
  </div>

  <div style={{ display: 'flex', flexDirection: 'column', width: '100%', padding:24,  fontSize: 30 }}>
    {/* Header */}
    <div style={{ display: 'flex'}}>
      <div style={{ flex: 1, textAlign: 'left', paddingLeft: '10px', border:'2px solid white', fontWeight:'bold'  }}>ID</div>
      <div style={{ flex: 2, textAlign: 'left', paddingLeft: '10px', border:'2px solid white', fontWeight:'bold'  }}>Username</div>
      <div style={{ flex: 3, textAlign: 'left', paddingLeft: '10px', border:'2px solid white', fontWeight:'bold'  }}>Tx</div>
    </div>

    {/* Data Rows */}


    {
      opts.data && opts.data.length > 0 ? (
        opts.data.map((item: any, index: number) => (
          <div key={index} style={{ display: 'flex'}}>
            <div style={{ flex: 1, textAlign: 'left', paddingLeft: '10px', border:'2px solid white', display:'flex'  }}>{item.id}</div>
            <div style={{ flex: 2, textAlign: 'left', paddingLeft: '10px', border:'2px solid white', display:'flex'  }}>{item.username}</div>
            <div style={{ flex: 3, textAlign: 'left', paddingLeft: '10px', border:'2px solid white', display:'flex'  }}>{item.tx}</div>
          </div>
        ))
      ) 

      : 

       (

     <div
    style={{
      marginTop:24,
      display:'flex',
      textAlign:'center',
      justifyContent:'center',
      whitespace:'pre-wrap'
    }}
  >
    {`No transactions were found. `}
  </div>
       )
    }
  </div>
</div>
);