import * as formattedDistricts from '../../../../formatted-districts.json'
const districtResolver = (lat: number, lng: number): string | null => {
  const features = formattedDistricts.features
  loop1: for (let i = 0; i < features.length; i++) {
    const coordinatesList: number[][] = features[i].geometry.coordinates[0]
    loop2: for (let j = 0; j < coordinatesList.length; j++) {
      const coordinates = coordinatesList[j]
      let lngIn = false
      let latIn = false
      loop3: for (let k = 0; k < coordinates.length; j++) {
        if (coordinates[k].toString().includes(lat.toString())) {
          latIn = true
        } else if (coordinates[k].toString().includes(lng.toString())) {
          lngIn = true
        }
      }

      if (lngIn && latIn) {
        return features[i].properties.Name
      }
    }
  }
  return null
}

export { districtResolver }
