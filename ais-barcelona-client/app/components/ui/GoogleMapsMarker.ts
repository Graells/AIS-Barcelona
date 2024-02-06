import { getShipImageUrl } from '@/app/utils/shipUtils';
import { MarkerWithLabel } from '@googlemaps/markerwithlabel';
import CreateInfoWindow from './CreateInfoWindow';
import { VesselData } from '@/app/definitions/vesselData';

const GoogleMapsMarker = ({
  map,
  sentences,
}: {
  map: google.maps.Map;
  sentences: VesselData[];
}) => {
  if (!Array.isArray(sentences)) {
    console.error('sentences is not an array');
    return;
  }

  google.maps
    .importLibrary('marker')
    .then((libraries) => {
      const { AdvancedMarkerElement, PinElement } =
        libraries as google.maps.MarkerLibrary;

      const intersectionObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('drop');
            intersectionObserver.unobserve(entry.target);
          }
        }
      });

      sentences.forEach((sentence) => {
        const shipImg = document.createElement('img');
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
          if (sentence.name && sentence.name != 'Unknown') {
            const nameTag = document.createElement('div');
            nameTag.className = 'name-tag';
            nameTag.style.display = 'none';
            nameTag.textContent = sentence.name;
            const labelLat = sentence.lat + 0.0025;
            const labelMarker = new AdvancedMarkerElement({
              map,
              position: { lat: labelLat, lng: sentence.lon },
              content: nameTag,
            });
            google.maps.event.addListener(map, 'zoom_changed', function () {
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
                lng: sentence.lon ?? 0,
              };

              nameTag.style.display = zoomLevel >= 13 ? 'block' : 'none';
            });
          }

          const content = marker.content as HTMLElement;
          content.style.opacity = '0';
          content.addEventListener('animationend', (event) => {
            content.classList.remove('drop');
            content.style.opacity = '1';
          });

          const time = 1 + Math.random();
          content.style.setProperty('--delay-time', time + 's');
          intersectionObserver.observe(content);

          const infowindow = CreateInfoWindow(sentence);

          marker.addListener('click', () => {
            infowindow.open({
              anchor: marker,
              map,
            });
          });
        }
      });
    })
    .catch((error) =>
      console.error('Failed to load Google Maps Marker library', error),
    );
  return null;
};

export default GoogleMapsMarker;
