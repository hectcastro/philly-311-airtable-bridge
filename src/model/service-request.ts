export interface ServiceRequest {
  service_request_id: string;
  status: string;
  status_notes: string;
  service_name: string;
  service_code: string;
  description?: null;
  agency_responsible: string;
  service_notice: string;
  requested_datetime: string;
  updated_datetime: string;
  expected_datetime: string;
  address: string;
  zipcode: string;
  lat: number;
  long: number;
}
