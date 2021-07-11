import Airtable from "airtable";
import axios from "axios";
import { ServiceRequest } from "./model/service-request";
import bunyan from "bunyan";

const BASE = Airtable.base("appZ8dYWkOzM3VdT6");
const CLIENT = axios.create({
  baseURL: "https://api.phila.gov/open311/v2/requests",
});
const LOGGER = bunyan.createLogger({
  name: "philly-311-airtable-bridge",
  level: bunyan.INFO,
  stream: process.stdout,
});

function capitalize(word: string) {
  if (!word) return word;
  return word[0].toUpperCase() + word.substr(1).toLowerCase();
}

async function updateServiceRecord(recordId: string, serviceRecordId: string) {
  const serviceRequest: ServiceRequest = (
    await CLIENT.get(`/${serviceRecordId}.json`)
  ).data[0];

  LOGGER.info(
    { airtableRecordId: recordId, serviceRecordId: serviceRecordId },
    "Updating"
  );

  BASE("Main").update([
    {
      id: recordId,
      fields: {
        ID: serviceRecordId,
        Status: capitalize(serviceRequest.status),
        "Status Notes": serviceRequest.status_notes,
        "Service Code": serviceRequest.service_code,
        "Service Name": serviceRequest.service_name,
        "Service Notice": serviceRequest.service_notice ?? "N/A",
        "Date Requested": serviceRequest.requested_datetime,
        "Date Expected": serviceRequest.expected_datetime,
        "Last Updated (By 311)": serviceRequest.updated_datetime,
        Address: serviceRequest.address,
        Department: serviceRequest.agency_responsible,
      },
    },
  ]);

  LOGGER.info(
    { airtableRecordId: recordId, serviceRecordId: serviceRecordId },
    "Update complete"
  );
}

export const init = async (): Promise<void> => {
  BASE("Main")
    .select()
    .eachPage(async (records) => {
      for (const record of records) {
        await updateServiceRecord(record.getId(), record.get("ID") as string);
      }
    });
};
