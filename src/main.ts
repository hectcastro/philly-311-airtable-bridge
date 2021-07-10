import Airtable from "airtable";
import axios from "axios";
import { ServiceRequest } from "./model/service-request";

const BASE = Airtable.base("appZ8dYWkOzM3VdT6");
const CLIENT = axios.create({
  baseURL: "https://api.phila.gov/open311/v2/requests",
});

function capitalize(word: string) {
  if (!word) return word;
  return word[0].toUpperCase() + word.substr(1).toLowerCase();
}

async function updateServiceRecord(recordId: string, serviceRecordId: string) {
  const serviceRequest: ServiceRequest = (
    await CLIENT.get(`/${serviceRecordId}.json`)
  ).data[0];

  process.stdout.write(`Update service record [${serviceRecordId}] ... `);

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

  console.log("Complete!");
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
