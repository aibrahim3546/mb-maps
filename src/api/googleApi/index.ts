export interface IPlace {
  description: string
  place_id: string
}

const getPlacesAutocomplete = (input: string): Promise<IPlace[]> => {
  return new Promise((resolve) => {
    const location = new google.maps.LatLng(3.1569, 101.7123)
    const autoCompleteService = new google.maps.places.AutocompleteService()

    autoCompleteService.getPlacePredictions({ input, location, radius: 50000 }, (places: IPlace[]) => {
      resolve(places)
    })
  })
}

interface IGeocoder {
  geometry: {
    location: {
      lat: () => void
      lng: () => void
    }
  }
}

const getGeolocation = (placeId: string): Promise<IGeocoder[]> => {
  return new Promise((resolve) => {
    const geocoder = new google.maps.Geocoder()

    geocoder.geocode({ placeId }, (results: IGeocoder[]) => {
      resolve(results)
    })
  })
}

const setMarker = (placeId: string, location: any) => {
  if (window.map) {
    let marker = window.marker

    if (!marker) {
      marker = new google.maps.Marker({ map: window.map });
      window.marker = marker
    }

    window.map.setZoom(15);
    window.map.setCenter(location);

    marker.setPlace({
      placeId: placeId,
      location: location,
    });

    marker.setVisible(true);
    marker.setMap(window.map)
  }
}

const googleApi = {
  getPlacesAutocomplete,
  getGeolocation,
  setMarker,
}

export default googleApi
