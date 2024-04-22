import { VesselData } from '../definitions/vesselData';

export const allShipTypes: string[] = [
  'Fishing',
  'Towing',
  'Dredging',
  'Diving',
  'Military',
  'Sailing',
  'Pleasure Craft',
  'High Speed Craft',
  'Pilot Vessel',
  'Search and Rescue',
  'Tug',
  'Port Tender',
  'Anti-Pollution',
  'Law Enforcement',
  'Medical Transport',
  'Non-Combatant',
  'Passenger',
  'Cargo',
  'Tanker',
  'Other',
];

const shipTypeToImagePath: { [key: string]: string } = {
  Fishing: '/fishing.png',
  Towing: '/towing.png',
  Dredging: '/dredging.png',
  Diving: '/diving.png',
  Military: '/military.png',
  Sailing: '/sailing.png',
  'Pleasure Craft': '/pleasure_craft.png',
  'High Speed Craft': '/high_speed_craft.png',
  'Pilot Vessel': '/pilot_vessel.png',
  'Search and Rescue': '/search_rescue.png',
  Tug: '/tug.png',
  'Port Tender': '/port_tender.png',
  'Anti-Pollution': '/anti_pollution.png',
  'Law Enforcement': '/law_enforcement.png',
  'Medical Transport': '/medical_transport.png',
  'Non-Combatant': '/military.png',
  Passenger: '/passenger.png',
  Cargo: '/cargo.png',
  Tanker: '/tanker.png',
  Other: '/ship.png',
};

export const getImagePathFromShipTypeName = (shipTypeName: string): string => {
  return shipTypeToImagePath[shipTypeName] || '/ship.png';
};

export const getShipImageUrl = (shipType: number) => {
  switch (shipType) {
    case 30:
      return '/fishing.png';
    case 31:
    case 32:
      return '/towing.png';
    case 33:
      return '/dredging.png';
    case 34:
      return '/diving.png';
    case 35:
      return '/military.png';
    case 36:
      return '/sailing.png';
    case 37:
      return '/pleasure_craft.png';
    case 40:
    case 41:
    case 42:
    case 43:
    case 44:
    case 45:
    case 46:
    case 47:
    case 48:
    case 49:
      return '/high_speed_craft.png';
    case 50:
      return '/pilot_vessel.png';
    case 51:
      return '/search_rescue.png';
    case 52:
      return '/tug.png';
    case 53:
      return '/port_tender.png';
    case 54:
      return '/anti_pollution.png';
    case 55:
      return '/law_enforcement.png';
    case 58:
      return '/medical_transport.png';
    case 59:
      return '/military.png';
    case 60:
    case 61:
    case 62:
    case 63:
    case 64:
    case 65:
    case 66:
    case 67:
    case 68:
    case 69:
      return '/passenger.png';
    case 70:
    case 71:
    case 72:
    case 73:
    case 74:
    case 75:
    case 76:
    case 77:
    case 78:
    case 79:
      return '/cargo.png';
    case 80:
    case 81:
    case 82:
    case 83:
    case 84:
    case 85:
    case 86:
    case 87:
    case 88:
    case 89:
      return '/tanker.png';
    default:
      return '/ship.png';
  }
};

export const getShipType = (shipType: number): string => {
  switch (shipType) {
    case 30:
      return 'Fishing';
    case 31:
    case 32:
      return 'Towing';
    case 33:
      return 'Dredging';
    case 34:
      return 'Diving';
    case 35:
      return 'Military';
    case 36:
      return 'Sailing';
    case 37:
      return 'Pleasure Craft';
    case 40:
    case 41:
    case 42:
    case 43:
    case 44:
    case 45:
    case 46:
    case 47:
    case 48:
    case 49:
      return 'High Speed Craft';
    case 50:
      return 'Pilot Vessel';
    case 51:
      return 'Search and Rescue';
    case 52:
      return 'Tug';
    case 53:
      return 'Port Tender';
    case 54:
      return 'Anti-Pollution';
    case 55:
      return 'Law Enforcement';
    case 58:
      return 'Medical Transport';
    case 59:
      return 'Non-Combatant';
    case 60:
    case 61:
    case 62:
    case 63:
    case 64:
    case 65:
    case 66:
    case 67:
    case 68:
    case 69:
      return 'Passenger';
    case 70:
    case 71:
    case 72:
    case 73:
    case 74:
    case 75:
    case 76:
    case 77:
    case 78:
    case 79:
      return 'Cargo';
    case 80:
    case 81:
    case 82:
    case 83:
    case 84:
    case 85:
    case 86:
    case 87:
    case 88:
    case 89:
      return 'Tanker';
    default:
      return 'Other';
  }
};

export const countVesselTypes = (
  sentences: VesselData[],
): { [key: string]: number } => {
  const counts: { [key: string]: number } = allShipTypes.reduce(
    (acc, type) => {
      acc[type] = 0;
      return acc;
    },
    {} as { [key: string]: number },
  );

  sentences.forEach((vessel) => {
    const typeName = getShipType(vessel.ship_type || 0);
    if (typeName in counts) {
      counts[typeName]++;
    }
  });

  return counts;
};

