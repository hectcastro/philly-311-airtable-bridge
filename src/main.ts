import Airtable from "airtable";
import axios from "axios";
import bunyan from "bunyan";
import { ServiceRequest } from "./model/service-request";

const BASE = Airtable.base(process.env.AIRTABLE_BASE_ID ?? "");
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
        Status: serviceRequest.status,
        "Status Notes": serviceRequest.statusNotes,
        "Service Code": serviceRequest.serviceCode,
        "Service Name": serviceRequest.serviceName,
        "Service Notice": serviceRequest.serviceNotice ?? "N/A",
        "Date Requested": serviceRequest.requestedDatetime,
        "Date Expected": serviceRequest.expectedDatetime,
        "Last Updated (By 311)": serviceRequest.updatedDatetime,
        Address: serviceRequest.address,
        Department: serviceRequest.agencyResponsible,
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
        if ((record.get("Status") as string) != "Closed") {
          await updateServiceRecord(record.getId(), record.get("ID") as string);
        }
      }
    });
};
