import { Request, Response } from 'express'
import { compact, flow, map } from 'lodash/fp'

import { API_KEY, constants, returnStatuses } from '../lib/constants'
import { failure, success } from '../lib/response'
import { districtResolver } from '../services/districtResolver'
import { makeGetRequest } from '../services/http'

const { MAP_URL } = constants
const { OK, NOT_FOUND, ERROR } = returnStatuses
interface IAddressComponent {
  long_name: string
  short_name: string
  types: string[]
}

const getAddressComponentByType = (addressComponents: any[], type: string): IAddressComponent => {
  const fn = (component: IAddressComponent) => {
    if (component.types.includes(type)) {
      return component
    }
    return
  }
  return flow(map(fn), compact)(addressComponents)[0]
}

/**
 * @api {get} /resolve/:address Get address district and location info
 * @apiName Get address district and location info
 * @apiGroup District Resolvers
 * @apiParam {string} address Adresss to locate district from
 *
 * @apiSuccess {String} status
 * @apiSuccess {String} search
 * @apiSuccess {Object} location
 * @apiSuccess {String} location.address1
 * @apiSuccess {String} location.address2
 * @apiSuccess {String} location.city
 * @apiSuccess {Number} location.lat
 * @apiSuccess {Number} location.lng
 * @apiSuccess {String} location.serviceArea
 * @apiSuccess {String} location.postcode
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "status": "OK",
 *      "search": "White Bear Yard"
 *      "location": {
 *        "address1": “2nd Floor, White Bear Yard”,
 *        "address2": “144a Clerkenwell Road”,
 *        "city": "London",
 *        "lat": 0.00000,
 *        "lng": 0.00000,
 *        “serviceArea”: “LONCENTRAL”,
 *        “postcode”: “EC1R5DF”
 *      },
 *    }
 *
 * @apiErrorExample {json} Error-Response
 *    {
 *      "status": "NOT_FOUND",
 *      "search": "White Bear Yard"
 *    }
 */
const resolveDistrict = async (req: Request, res: Response) => {
  const { address } = req.params
  const { error, ...rest } = await makeGetRequest(MAP_URL, { address, key: API_KEY })
  if (error) {
    const { message, httpCode } = rest
    return failure({ res, data: { status: ERROR, search: address }, message, httpCode })
  }

  const { lat, lng } = rest.results[0].geometry.location
  const districtName = districtResolver(lat, lng)
  if (!districtName) {
    return failure({ res, data: { status: NOT_FOUND, search: address }, httpCode: 400 })
  }
  const city = getAddressComponentByType(rest.results[0].address_components, 'postal_town')
    .long_name
  const postcode = getAddressComponentByType(rest.results[0].address_components, 'postal_code')
    .long_name
  const data = {
    status: OK,
    search: address,
    location: {
      address1: rest.results[0].formatted_address,
      address2: '',
      city,
      lat: lat as number,
      lng: lng as number,
      serviceArea: districtName,
      postcode,
    },
  }
  return success({ res, data, httpCode: 200 })
}

export { resolveDistrict }
