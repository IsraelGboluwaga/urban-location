export const { API_KEY, NODE_ENV, PORT } = process.env

export const constants = {
  MAP_URL: 'https://maps.googleapis.com/maps/api/geocode/json?',
}

export const returnStatuses = {
  OK: 'OK',
  NOT_FOUND: 'NOT_FOUND',
  ERROR: 'ERROR',
}
