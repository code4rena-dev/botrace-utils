import t from "tap";
import { readFile } from "node:fs/promises";
import Path from "node:path";

import { Report } from "../lib/types";

import {
  defaultVersion,
  renderReport,
  validateReport,
  schemas
} from "../lib";

let basicReport:Report;
let invalidReport:Report;

void t.before(async () => {
  const basic = await readFile(
    Path.resolve("./test/fixtures/json-reports/basic.json"),
    { encoding: "utf-8" }
  );
  basicReport = JSON.parse(basic) as Report;

  const invalid = await readFile(
    Path.resolve("./test/fixtures/json-reports/invalid.json"),
    { encoding: "utf-8" }
  );
  invalidReport = JSON.parse(invalid) as Report;
});

void t.test("should render a basic report", (t) => {
  t.matchSnapshot(renderReport(basicReport));
  t.end();
});

void t.test("should render a basic best bot report", (t) => {
  t.matchSnapshot(renderReport(basicReport, "cool-bot"));
  t.end();
});

void t.test("should validate a good report", (t) => {
  for (const schema of Object.values(schemas)) {
    t.equal(validateReport(basicReport, schema), null);
  }
  t.end();
});

void t.test("should error on invalid report (schema 0.1)", (t) => {
  const schema = schemas["0.1.0"];

  t.same(validateReport(invalidReport, schema), [{
    "instancePath": "/findings/0/instances/0",
    "message": "must be object"
  }]);
  t.end();
});

void t.test("should error on invalid report (schema 0.2)", (t) => {
  const schema = schemas["0.2.0"];

  t.same(validateReport(invalidReport, schema), [{
    "instancePath": "/findings/0/severity",
    "message": "must be equal to one of the allowed values"
  }, {
    "instancePath": "/findings/0/instances/0",
    "message": "must be object"
  }, {
    "instancePath": "/findings/2/severity",
    "message": "must be equal to one of the allowed values"
  }]);
  t.end();
});

void t.test("should error on invalid report (schema default)", (t) => {
  const schema = schemas[defaultVersion];

  t.same(validateReport(invalidReport, schema), [{
    "instancePath": "/findings/0/severity",
    "message": "must be equal to one of the allowed values"
  }, {
    "instancePath": "/findings/0/instances/0",
    "message": "must be object"
  }, {
    "instancePath": "/findings/1/instances/0/content",
    "message": "must match pattern \"^(`{3})[^`]*(\\1)$\"",
  }, {
    "instancePath": "/findings/1/instances/0/loc/1",
    "message": "must match pattern \"https:\\/\\/github\\.com\\/[^\\/]+\\/.*#L\\d+(-L\\d+)?\\)?$\"",
  }, {
    "instancePath": "/findings/2/severity",
    "message": "must be equal to one of the allowed values"
  }, {
    "instancePath": "/findings/2/instances/0/content",
    "message": "must match pattern \"^(`{3})[^`]*(\\1)$\"",
  }, {
    "instancePath": "/findings/2/instances/0/loc/0",
    "message": "must match pattern \"https:\\/\\/github\\.com\\/[^\\/]+\\/.*#L\\d+(-L\\d+)?\\)?$\"",
  }, {
    "instancePath": "/findings/2/instances/0/loc/1",
    "message": "must match pattern \"https:\\/\\/github\\.com\\/[^\\/]+\\/.*#L\\d+(-L\\d+)?\\)?$\"",
  }, {
    "instancePath": "/findings/2/instances/0/loc/2",
    "message": "must match pattern \"https:\\/\\/github\\.com\\/[^\\/]+\\/.*#L\\d+(-L\\d+)?\\)?$\"",
  }]);
  t.end();
});