"use client";

import React, { useEffect, useRef, useState } from "react";
import loadGoogleMapsApi from "@/app/lib/GoogleMapsLoader";
import GoogleMapsMarker from "@/app/lib/GoogleMapsMarker";

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
      let map = new Map(mapRef.current, {
        center: { lat: 41.3874, lng: 2.1686 },
        zoom: 10,
        mapId: "DEMO_MAP_ID",
      });
      setMapInstance(map);
    };

    initializeMap();
  }, []);

  return (
    <>
      <div className="h-[700px] m-20 border-4 border-black" ref={mapRef} />
      {mapInstance && (
        <GoogleMapsMarker map={mapInstance} sentences={sentences} />
      )}
    </>
  );
};

export default Mapa;
