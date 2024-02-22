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
