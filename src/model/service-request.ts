export interface ServiceRequest {
  serviceRequestID: string;
  status: string;
  statusNotes: string;
  serviceName: string;
  serviceCode: string;
  description: null;
  agencyResponsible: string;
  serviceNotice: string;
  requestedDatetime: string;
  updatedDatetime: string;
  expectedDatetime: string;
  address: string;
  zipcode: null;
  lat: number;
  long: number;
}
