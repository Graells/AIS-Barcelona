import { VesselData } from '@/app/definitions/vesselData';

const CreateInfoWindow = (sentence: VesselData): google.maps.InfoWindow => {
  return new google.maps.InfoWindow({
    content: sentence.name,
    ariaLabel: 'info window',
  });
};
export default CreateInfoWindow;
