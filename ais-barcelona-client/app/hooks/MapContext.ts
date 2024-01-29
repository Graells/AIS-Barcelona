"use client";

import { createContext, useContext } from "react";

export const MapContext = createContext<any>(null);

export const useMap = () => useContext(MapContext);
