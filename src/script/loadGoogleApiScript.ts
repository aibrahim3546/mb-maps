const loadGoogleApiScript = () => {
  const initMap = () => {
    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 3.1569, lng: 101.7123 },
      zoom: 10,
    });

    window.map = map
  }

  window.initMap = initMap;

  const script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places&callback=initMap&v=weekly`
  document.body.append(script)

  const remove = () => {
    document.body.removeChild(script)
  }

  return { remove }
}

export default loadGoogleApiScript
