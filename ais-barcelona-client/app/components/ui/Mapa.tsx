"use client";

import React, { useEffect, useRef, useState } from "react";
import loadGoogleMapsApi from "@/app/lib/GoogleMapsLoader";

const Mapa = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadGoogleMapsApi();
    const initializeMap = async () => {
      if (!mapRef.current) return;
      try {
        const { Map } = (await google.maps.importLibrary(
          "maps"
        )) as google.maps.MapsLibrary;
        let map = new Map(mapRef.current!, {
          center: { lat: 41.3874, lng: 2.1686 },
          zoom: 14,
        });
      } catch (error: any) {
        console.error(`Geocoding failed: ${error.message}`);
      }
    };

    initializeMap();
  }, []);

  return <div className="h-[700px] m-20 border-4 border-black" ref={mapRef} />;
};

export default Mapa;
