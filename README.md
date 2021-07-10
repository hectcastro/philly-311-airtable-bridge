# philly-311-airtable-bridge

This is a vanilla TypeScript project to update the contents of an Airtable base with status information related to [Philly 311](https://www.phila.gov/services/property-lots-housing/track-a-service-request-with-311/) service requests.

## Usage

Start by installing the dependencies:

```bash
$ npm install
```

Then, run the Airtable population script:

```bash
$ export AIRTABLE_API_KEY="..."
$ npm run cli

> cli
> ts-node src/cli.ts

Update service record [14225545] ... Complete!
Update service record [14258766] ... Complete!
Update service record [14258777] ... Complete!
Update service record [14115475] ... Complete!
Update service record [14258707] ... Complete!
Update service record [14225534] ... Complete!
```
