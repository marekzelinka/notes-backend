import { setupApp } from './app.js'
import { env } from './utils/env.js'
import { logInfo } from './utils/logger.js'

setupApp()
  .then((app) => {
    app.listen(env.PORT, () => {
      logInfo(`Server running on port ${env.PORT}`)
    })
  })
  .catch(console.dir)
