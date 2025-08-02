/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Geolocation API 타입 정의
declare global {
  interface GeolocationPosition {
    readonly coords: GeolocationCoordinates;
    readonly timestamp: number;
  }

  interface GeolocationCoordinates {
    readonly accuracy: number;
    readonly altitude: number | null;
    readonly altitudeAccuracy: number | null;
    readonly heading: number | null;
    readonly latitude: number;
    readonly longitude: number;
    readonly speed: number | null;
  }

  interface GeolocationPositionError {
    readonly PERMISSION_DENIED: 1;
    readonly POSITION_UNAVAILABLE: 2;
    readonly TIMEOUT: 3;
    readonly code: 1 | 2 | 3;
    readonly message: string;
  }
}

export interface ImportMeta {
  env: {
    VITE_APP_API_URL?: string
  }
}
