import { app } from './app.js'
import { env } from './utils/env.js'
import { logInfo } from './utils/logger.js'

app.listen(env.PORT, () => {
  logInfo(`Server running on port ${env.PORT}`)
})
