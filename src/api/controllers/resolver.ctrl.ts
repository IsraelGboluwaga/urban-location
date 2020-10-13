import { Request, Response } from 'express'

import { API_KEY, constants, returnStatuses } from '../lib/constants'
import { failure, success } from '../lib/response'
import { makeGetRequest } from '../services/http'

const { MAP_URL } = constants
const { OK, NOT_FOUND, ERROR } = returnStatuses

const resolveDistrict = async (req: Request, res: Response) => {
  const { address } = req.params
  // validate address
  const { error, ...rest } = await makeGetRequest(MAP_URL, { address, key: API_KEY })
  if (error) {
    const { message, httpCode } = rest
    return failure({ res, data: { status: ERROR, search: address }, message, httpCode })
  }

  // todo: take the response and run through the districtResolver service
  return res.json(rest)
}

export { resolveDistrict }
