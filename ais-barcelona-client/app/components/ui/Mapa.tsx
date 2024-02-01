"use client";

import React, { useEffect, useRef, useState } from "react";
import loadGoogleMapsApi from "@/app/lib/GoogleMapsLoader";
import GoogleMapsMarker from "@/app/lib/GoogleMapsMarker";
import GoogleMapsStyle from "@/app/lib/GoogleMapsStyle";

const Mapa = ({ sentences }: { sentences: any[] }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    loadGoogleMapsApi();
    const initializeMap = async () => {
      if (!mapRef.current) return;
      const { Map } = (await google.maps.importLibrary(
        "maps"
      )) as google.maps.MapsLibrary;
      let map = new Map(mapRef.current as HTMLDivElement, {
        center: { lat: 41.326938, lng: 2.169317 },
        zoom: 12,
        mapId: "4454e7c0063d29a3",
        // disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: "greedy",
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          mapTypeIds: ["roadmap", "terrain"],
        },
        scaleControl: true,
        streetViewControl: false,
        rotateControl: true,
        fullscreenControl: true,
      });

      setMapInstance(map);
    };

    initializeMap();
  }, []);

  return (
    <>
      <div
        className="mx-5 h-[700px] rounded-xl border-4 border-black md:mx-20"
        ref={mapRef}
      />
      {mapInstance && (
        <div>
          <GoogleMapsMarker map={mapInstance} sentences={sentences} />
          {/* <GoogleMapsStyle map={mapInstance} /> */}
        </div>
      )}
    </>
  );
};

export default Mapa;
