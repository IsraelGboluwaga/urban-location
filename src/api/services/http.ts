import axios from 'axios'

const makeGetRequest = async (url: string, params?: any) => {
  try {
    const { status, data } = await axios.get(url, { params, responseType: 'json' })
    if (status === 200 && data) {
      return data
    }
  } catch (err: any) {
    return { error: true, message: err.response.data, httpCode: err.response.status }
  }
}

export { makeGetRequest }
