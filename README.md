# @danieljdufour/json-to-csv
> Convert Array of Nested JSON Data to CSV

## install
```js
npm install @danieljdufour/json-to-csv
```

## usage
```js
import { convert } from "@danieljdufour/json-to-csv";

data = {
  "agency": "GSA",
  "measurementType": {
    "method": "modules"
  },
  "version": "2.0.0",
  "releases": [
    {
      "name": "usasearch",
      "description": "System now maintained in open repo https://github.com/GSA/search-gov.",
      "permissions": {
        "licenses": null,
        "usageType": "governmentWideReuse"
      },
      "tags": [
        "GSA"
      ]
    },
    // ...
  ]
}

const csv = convert(data, {
  columns: [
    { name: "name", path: "name" },
    { name: "description", path: "description" },
    { name: "license", path: "permissions.licenses.name" },
    { name: "tags", path: "tags" }
  ],
  limit: 5,
  offset: 10,
  start: "releases"
});

`name,description,license,tags
resque-priority,Simple priority control when enqueuing Resque jobs.,mit,GSA
open311-simple-crm,Open311 Simple CRM,other,GSA
datafiles-wordpress-plugin,"Allows sites to serve and track changes of root level XML, JSON, and other data files without directly uploading files to the server",,GSA
federal-open-source-repos-php,"PHP Class to retrieve details about federal open source code hosted on GitHub  ",,GSA
federal-open-source-repos,Uses Javascript to query the Social Media Registry and GitHub APIs and list details about all federal open source code on GitHub,bsd-3-clause,GSA`
```
