"use client";

import { useEffect, useRef, useState } from 'react';
import loadGoogleMapsApi from '@/app/lib/GoogleMapsLoader';
import GoogleMapsMarker from '@/app/components/ui/GoogleMapsMarker';
import { VesselData } from '@/app/definitions/vesselData';

export default function Mapa({
  sentences,
  mmsi,
}: {
  sentences: VesselData[];
  mmsi: number;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    loadGoogleMapsApi();
    const initializeMap = async () => {
      if (!mapRef.current) return;
      const { Map } = (await google.maps.importLibrary(
        'maps',
      )) as google.maps.MapsLibrary;
      let map = new Map(mapRef.current as HTMLDivElement, {
        center: { lat: 41.326938, lng: 2.169317 },
        zoom: 12,
        mapId: '4454e7c0063d29a3',
        // disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: 'greedy',
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          mapTypeIds: ['roadmap', 'terrain'],
        },
        scaleControl: true,
        streetViewControl: false,
        rotateControl: true,
        fullscreenControl: true,
      });
      const legendElement = document.getElementById('legend');
      if (legendElement) {
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
          legendElement,
        );
      }
      setMapInstance(map);
    };

    initializeMap();
  }, []);

  return (
    <>
      <div
        className=" mx-0.5 h-[430px] rounded-md border-2 border-black dark:border-white md:h-[700px] md:w-[1100px]"
        ref={mapRef}
      />
      {mapInstance && (
        <div>
          <GoogleMapsMarker
            map={mapInstance}
            sentences={sentences}
            mmsi={mmsi}
          />
        </div>
      )}
    </>
  );
};
