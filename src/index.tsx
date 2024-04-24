import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { devtools } from 'frog/dev'
import { getFrogApp } from './utils/app'

import { isLive } from './utils/dev-tools'

import TipController from './controllers/tip'

export const app = getFrogApp();

app.use('/*', serveStatic({ root: './public' }))

app.frame("/", (c)=>TipController(c,"/"))

app.castAction('/tip', (c) => {
  console.log(
    `Cast Action to ${JSON.stringify(c.actionData.castId)} from ${
      c.actionData.fid
    }`,
  )
  return c.res({ message: 'Action Succeeded' })
})

const port: number | undefined = process.env.PORT ? +process.env.PORT : undefined;

if(!isLive()){
  devtools(app, { serveStatic })
}

serve({
  fetch: app.fetch,
  port,
})

console.log(`Server is running on port ${port}`)