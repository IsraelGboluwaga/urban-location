import '../../setup/envConfig'

import * as express from 'express'

import { resolveDistrict } from './controllers/resolver.ctrl'

const routes = (app: express.Router) => {
  app.get('/resolve/:address', resolveDistrict)
  return app
}

export { routes }
