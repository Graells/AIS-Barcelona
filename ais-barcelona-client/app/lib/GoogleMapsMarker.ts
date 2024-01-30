const GoogleMapsMarker = ({
  map,
  sentences,
}: {
  map: google.maps.Map;
  sentences: any[];
}) => {
  console.log("sentences", sentences);
  if (!Array.isArray(sentences)) {
    console.error("sentences is not an array");
    return;
  }

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
        const tankerImg = document.createElement("img");
        if (sentence.ship_type) {
          tankerImg.src =
            sentence.ship_type > 79 && sentence.ship_type < 90
              ? "/tanker.png"
              : "/ship.png";
        }
        if (sentence.lat && sentence.lon) {
          console.log("sentence", sentence);
          new AdvancedMarkerElement({
            map,
            position: { lat: sentence.lat, lng: sentence.lon },
            title: sentence.name,
            content: tankerImg,
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
