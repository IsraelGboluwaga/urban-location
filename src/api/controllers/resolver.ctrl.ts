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
