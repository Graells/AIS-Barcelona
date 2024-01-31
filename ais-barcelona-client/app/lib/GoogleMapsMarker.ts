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
      const { AdvancedMarkerElement } = libraries as google.maps.MarkerLibrary;

      const intersectionObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("drop");
            intersectionObserver.unobserve(entry.target);
          }
        }
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
          let collisionBehavior = google.maps.CollisionBehavior.REQUIRED;
          const marker = new AdvancedMarkerElement({
            map,
            position: { lat: sentence.lat, lng: sentence.lon },
            title: sentence.name,
            content: tankerImg,
            collisionBehavior,
          });

          const content = marker.content as HTMLElement;
          content.style.opacity = "0";
          content.addEventListener("animationend", (event) => {
            content.classList.remove("drop");
            content.style.opacity = "1";
          });

          const time = 2 + Math.random();
          content.style.setProperty("--delay-time", time + "s");
          intersectionObserver.observe(content);

          const infowindow = new google.maps.InfoWindow({
            content: sentence.name,
            ariaLabel: "info window",
          });
          marker.addListener("click", () => {
            infowindow.open({
              anchor: marker,
              map,
            });
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
