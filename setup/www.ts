/** Module dependencies. */
import './envConfig'

import * as rootPath from 'app-root-path'
import * as fs from 'fs'
import * as http from 'http'

import { NODE_ENV, PORT } from '../src/api/lib/constants'
import { UrbanLocator } from '../src/app'
import { logger } from '../src/config/winston'

/** Create log file */
try {
  fs.mkdir(`${rootPath}/logs/`, (error: { code?: string; errno?: number } | null) => {
    if (!error || error?.code === 'EEXIST' || error?.errno === -17) {
      fs.open(`${rootPath}/logs/${logger.transports.file.filename}`, 'w', (err: any, fd: any) => {
        if (fd) {
          fs.close(fd, (e: any) => {
            if (!e) {
              logger.info(`Log file ${fd} created successfully`)
            }
          })
        }
      })
    }
  })
} catch (e) {
  logger.error('Error occurred in creating log file:: ', e)
}

/** Normalize a port into a number, string, or false. */
const normalizePort = (val: string): number => {
  const connPort = parseInt(val, 10)
  return connPort >= 0 ? connPort : isNaN(connPort) ? 9999 : 0
}

/** Event listener for HTTP server "error" event. */
const onError = (error: any) => {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(`${error.code}: ${bind} requires elevated privileges`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      logger.error(`${error.code}: ${bind} is already in use`)
      process.exit(1)
      break
    default:
      logger.error(`${error.code}: not sure what happened here`)
      throw error
  }
}

const nodeEnv: string | undefined = NODE_ENV
const port: number = normalizePort(PORT || '3033')

/** Event listener for HTTP server "listening" event. */
const onListening = () => {
  const addr = server.address()
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`
  if (process.env.NODE_ENV !== 'test') {
    logger.info(`Listening on ${bind} in ${nodeEnv} environment`)
  }
}

/** Initialize api service */
const api = new UrbanLocator()
const app = api.app

app.set('port', port)

/** Create HTTP server. */
const server = http.createServer(app)

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

export { server }
