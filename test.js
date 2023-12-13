const fs = require("fs");
const test = require("flug");
const { convert } = require("./index.js");

const data = require("./data/code.json");

test("example", ({ eq }) => {
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
  eq(
    csv,
    `name,description,license,tags\r\nresque-priority,Simple priority control when enqueuing Resque jobs.,mit,GSA\r\nopen311-simple-crm,Open311 Simple CRM,other,GSA\r\ndatafiles-wordpress-plugin,"Allows sites to serve and track changes of root level XML, JSON, and other data files without directly uploading files to the server",,GSA\r\nfederal-open-source-repos-php,"PHP Class to retrieve details about federal open source code hosted on GitHub  ",,GSA\r\nfederal-open-source-repos,Uses Javascript to query the Social Media Registry and GitHub APIs and list details about all federal open source code on GitHub,bsd-3-clause,GSA`
  );
  fs.writeFileSync("./test-output/example.csv", csv);
});

test("default", ({ eq }) => {
  const csv = convert(data, {
    limit: 5,
    start: "releases"
  });
  eq(
    csv,
    `contact.email,description,governmentWideReuseProject,homepageURL,laborHours,languages,license,name,openSourceProject,organization,permissions.licenses.URL,permissions.licenses.name,permissions.usageType,repositoryURL,tags,vcs\r\ngsa-github.support@gsa.gov,System now maintained in open repo https://github.com/GSA/search-gov.,,https://search.gov,0,,,usasearch,,GSA,,,governmentWideReuse,https://github.com/GSA/usasearch,GSA,git\r\ngsa-github.support@gsa.gov,"The ~search/scripts directory on the CRON machine, containing all scripts for the 'search' user",,,0,,,cron_scripts,,GSA,,,governmentWideReuse,https://github.com/GSA/cron_scripts,GSA,git\r\ngsa-github.support@gsa.gov,Automatically detect mobile requests from mobile devices in your Rails application.,,http://www.intridea.com/2008/7/21/mobilize-your-rails-application-with-mobile-fu,0,Ruby,,mobile-fu,,GSA,http://choosealicense.com/licenses/mit/,mit,openSource,https://github.com/GSA/mobile-fu,GSA,git\r\ngsa-github.support@gsa.gov,A rails plugin that provides simple block helpers to introduce google visualizations (gap minder),,http://informaddicts.blogspot.com,0,Ruby,,rails-google-visualization-plugin,,GSA,http://choosealicense.com/licenses/gpl-3.0/,gpl-3.0,openSource,https://github.com/GSA/rails-google-visualization-plugin,GSA,git\r\ngsa-github.support@gsa.gov,rails plugin for parsing apache log,,,0,Ruby,,apache-log-parser,,GSA,http://choosealicense.com/licenses/mit/,mit,openSource,https://github.com/GSA/apache-log-parser,GSA,git`
  );
  fs.writeFileSync("./test-output/default.csv", csv);
});
