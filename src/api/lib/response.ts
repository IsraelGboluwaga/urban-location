import express from 'express'

interface ILocation {
  address1: string
  address2: string | null
  city: string
  lat: number
  lng: number
  serviceArea: string
  postcode: string
}

interface IData {
  status: string
  search: string
  location?: ILocation
  error?: any
}

interface IResponse {
  res: express.Response
  data: IData
  httpCode: number
}

function respond({ res, httpCode, data }: IResponse) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Method', '*')
  return res.status(httpCode).send(data)
}

interface ISuccess {
  res: express.Response
  data: IData
  httpCode: number
}

export const success = ({ res, data, httpCode }: ISuccess) => {
  return respond({ res, httpCode, data })
}

interface IFail {
  res: express.Response
  data: IData
  message?: any
  httpCode: number
}
export const failure = ({ res, message, data, httpCode }: IFail) => {
  data.error = message
  return respond({ res, httpCode, data })
}
