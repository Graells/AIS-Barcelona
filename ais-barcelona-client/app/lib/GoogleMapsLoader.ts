import { Loader } from '@googlemaps/js-api-loader';

const loadGoogleMapsApi = async () => {
  const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
    version: 'weekly',
    // libraries: ['places', 'geocoding'],
  });
  try {
    await loader.importLibrary('core'); // maps
  } catch (error: any) {
    console.error(`Failed to load Google Maps: ${error.message}`);
  }
};

export default loadGoogleMapsApi;