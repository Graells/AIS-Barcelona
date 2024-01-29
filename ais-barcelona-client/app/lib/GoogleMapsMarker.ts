const GoogleMapsMarker = ({
  map,
  sentences,
}: {
  map: google.maps.Map;
  sentences: any[];
}) => {
  // Ensure sentences is an array before proceeding
  console.log("sentences", sentences);
  if (!Array.isArray(sentences)) {
    console.error("sentences is not an array");
    return;
  }

  // Load marker library asynchronously
  google.maps
    .importLibrary("marker")
    .then((libraries) => {
      const { AdvancedMarkerElement, PinElement } =
        libraries as google.maps.MarkerLibrary;

      const pinScaled = new PinElement({
        scale: 1.5,
        background: "#FBBC04",
        glyphColor: "white",
      });

      sentences.forEach((sentence) => {
        if (sentence.lat && sentence.lon) {
          console.log("sentence", sentence);
          new AdvancedMarkerElement({
            map,
            position: { lat: sentence.lat, lng: sentence.lon },
            title: sentence.name,
            // content: pinScaled.element,
          });
        }
      });
    })
    .catch((error) =>
      console.error("Failed to load Google Maps Marker library", error)
    );
  return null;
};

export default GoogleMapsMarker;
