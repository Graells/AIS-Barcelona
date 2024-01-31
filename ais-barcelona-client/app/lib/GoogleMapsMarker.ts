import { MarkerWithLabel } from "@googlemaps/markerwithlabel";

const GoogleMapsMarker = ({
  map,
  sentences,
}: {
  map: google.maps.Map;
  sentences: any[];
}) => {
  if (!Array.isArray(sentences)) {
    console.error("sentences is not an array");
    return;
  }

  google.maps
    .importLibrary("marker")
    .then((libraries) => {
      const { AdvancedMarkerElement, PinElement } =
        libraries as google.maps.MarkerLibrary;

      const intersectionObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("drop");
            intersectionObserver.unobserve(entry.target);
          }
        }
      });

      sentences.forEach((sentence) => {
        const shipImg = document.createElement("img");
        if (sentence.ship_type) {
          const shipImgSrc = getShipImageUrl(sentence.ship_type);
          shipImg.src = shipImgSrc;
        }
        if (sentence.lat && sentence.lon) {
          let collisionBehavior = google.maps.CollisionBehavior.REQUIRED;
          const marker = new AdvancedMarkerElement({
            map,
            position: { lat: sentence.lat, lng: sentence.lon },
            title: sentence.name,
            content: shipImg,
            collisionBehavior,
          });
          if (sentence.name && sentence.name != "Unknown") {
            const nameTag = document.createElement("div");
            nameTag.className = "name-tag";
            nameTag.style.display = "none";
            nameTag.textContent = sentence.name;
            const labelLat = sentence.lat + 0.0025;
            const labelMarker = new AdvancedMarkerElement({
              map,
              position: { lat: labelLat, lng: sentence.lon },
              content: nameTag,
            });
            google.maps.event.addListener(map, "zoom_changed", function () {
              let zoomLevel = map.getZoom() || 0;
              let latOffset;

              if (zoomLevel >= 17.5) {
                latOffset = 0.00240005;
              } else if (zoomLevel >= 17) {
                latOffset = 0.0023;
              } else if (zoomLevel >= 16) {
                latOffset = 0.002;
              } else if (zoomLevel >= 15) {
                latOffset = 0.0017;
              } else if (zoomLevel >= 14.5) {
                latOffset = 0.0015;
              } else if (zoomLevel >= 14) {
                latOffset = 0.001;
              } else if (zoomLevel >= 13.5) {
                latOffset = 0.0007;
              } else {
                latOffset = 0;
              }
              labelMarker.position = {
                lat: labelLat - latOffset,
                lng: sentence.lon,
              };

              nameTag.style.display = zoomLevel >= 13 ? "block" : "none";
            });
          }

          const content = marker.content as HTMLElement;
          content.style.opacity = "0";
          content.addEventListener("animationend", (event) => {
            content.classList.remove("drop");
            content.style.opacity = "1";
          });

          const time = 1 + Math.random();
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

const getShipImageUrl = (shipType: number) => {
  switch (shipType) {
    case 30:
      return "/fishing.png";
    case 31:
    case 32:
      return "/towing.png";
    case 33:
      return "/dredging.png";
    case 34:
      return "/diving.png";
    case 35:
      return "/military.png";
    case 36:
      return "/sailing.png";
    case 37:
      return "/pleasure_craft.png";
    case 50:
      return "/pilot_vessel.png";
    case 51:
      return "/search_rescue.png";
    case 52:
      return "/tug.png";
    case 53:
      return "/port_tender.png";
    case 54:
      return "/anti_pollution.png";
    case 55:
      return "/law_enforcement.png";
    case 58:
      return "/medical_transport.png";
    case 60:
    case 61:
    case 62:
    case 63:
    case 64:
    case 65:
    case 66:
    case 67:
    case 68:
    case 69:
      return "/passenger.png";
    case 70:
    case 71:
    case 72:
    case 73:
    case 74:
    case 75:
    case 76:
    case 77:
    case 78:
    case 79:
      return "/cargo.png";
    case 80:
    case 81:
    case 82:
    case 83:
    case 84:
    case 85:
    case 86:
    case 87:
    case 88:
    case 89:
      return "/tanker.png";
    default:
      return "/ship.png";
  }
};
