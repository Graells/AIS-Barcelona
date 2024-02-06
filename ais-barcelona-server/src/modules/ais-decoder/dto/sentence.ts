export interface BaseSentence {
  msg_type: number;
  mmsi: number;
  repeat?: number;
  accuracy?: boolean;
  lon?: number;
  lat?: number;
  raim?: boolean;
  radio?: number;
  second?: number;
}

export interface SentenceType1 extends BaseSentence {
  status?: number;
  turn?: number;
  speed?: number;
  course?: number;
  heading?: number;
}
export interface SentenceType4 extends BaseSentence {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  epfd?: number;
}

export interface SentenceType5 extends BaseSentence {
  ais_version?: number;
  imo?: number;
  callsign?: string;
  shipname?: string;
  ship_type?: number;
  to_bow?: number;
  to_stern?: number;
  to_port?: number;
  to_starboard?: number;
  epfd?: number;
}

export type Sentence = SentenceType4 | SentenceType1 | SentenceType5;

// interface Sentence {
//   vendorid: string;
//   draught: number;
//   destination: string;
//   data: Uint8Array; // Assuming binary data is represented in a byte array
//   month: number;
//   raim: boolean;
//   turn: number;
//   dsc: boolean;
//   fid: number;
//   number2: number;
//   offset4: number;
//   radio: number;
//   timeout4: string; // If undefined behavior is possible, this might be string
//   display: boolean;
//   repeat: number;
//   increment1: number;
//   name: string;
//   dte: boolean;
//   day: number;
//   ais_version: number;
//   maneuver: number;
//   band: boolean; // Assuming 'TRUE' or 'FALSE' values, which correspond to boolean
//   number4: string; // Undefined behavior suggests this could be string or another type
//   ship_type: number;
//   lon: number;
//   year: number;
//   reserved_1: number;
//   second: number;
//   course: number;
//   to_starboard: number;
//   shipname: string;
//   to_bow: number;
//   epfd: number; // Assuming 'F' represents a flag or a char, could be string
//   timeout1: number;
//   name_ext: string;
//   callsign: string;
//   number1: number;
//   speed: number;
//   partno: number;
//   off_position: boolean;
//   status: number;
//   msg_type: number;
//   offset2: number;
//   to_stern: number;
//   accuracy: boolean;
//   lat: number;
//   increment3: number;
//   cs: boolean;
//   offset1: number;
//   assigned: boolean;
//   dac: number;
//   offset3: number;
//   model: string;
//   increment4: number;
//   heading: number;
//   reserved_2: number;
//   msg22: boolean;
//   increment2: number;
//   aid_type: number;
//   number3: number;
//   mmsi: number;
//   timeout3: number;
//   to_port: number;
//   timeout2: number;
//   serial: number;
//   imo: number;
//   virtual_aid: boolean;
//   hour: number;
//   spare_1: Uint8Array; // If this is binary data
//   minute: number;
// }
