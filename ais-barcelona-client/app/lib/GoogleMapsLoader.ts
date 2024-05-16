import { Loader } from '@googlemaps/js-api-loader';

export default async function loadGoogleMapsApi() {
  const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
    version: 'weekly',
    // libraries: ['places', 'geocoding'],
  });
  try {
    await loader.importLibrary('maps'); // maps
  } catch (error: any) {
    console.error(`Failed to load Google Maps: ${error.message}`);
  }
};
