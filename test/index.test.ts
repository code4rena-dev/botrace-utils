import t from "tap";
import { readFile } from "node:fs/promises";
import Path from "node:path";

import { Report } from "../lib/types";

import {
  SCHEMA_VERSIONS,
  renderReport,
  validateReport
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

void t.test("should validate a good report", async (t) => {
  for (const version of SCHEMA_VERSIONS) {
    const schemaPath = Path.resolve(`./lib/schemas/${version}.json`);
    const schemaFile = await readFile(schemaPath, { encoding: "utf8" });
    const schema = JSON.parse(schemaFile) as JSON;

    t.equal(validateReport(basicReport, schema), null);
  }
});

void t.test("should error on invalid report (schema 0.1)", async (t) => {
  const schemaPath = Path.resolve(`./lib/schemas/0.1.0.json`);
  const schemaFile = await readFile(schemaPath, { encoding: "utf8" });
  const schema = JSON.parse(schemaFile) as JSON;

  t.same(validateReport(invalidReport, schema), [{
    "instancePath": "/findings/0/instances/0",
    "message": "must be object"
  }]);
});

void t.test("should error on invalid report (schema 0.2)", async (t) => {
  const schemaPath = Path.resolve(`./lib/schemas/0.2.0.json`);
  const schemaFile = await readFile(schemaPath, { encoding: "utf8" });
  const schema = JSON.parse(schemaFile) as JSON;

  t.same(validateReport(invalidReport, schema), [{
    "instancePath": "/findings/0/severity",
    "message": "must be equal to one of the allowed values"
  }, {
    "instancePath": "/findings/0/instances/0",
    "message": "must be object"
  }, {
    "instancePath": "/findings/1/severity",
    "message": "must be equal to one of the allowed values"
  }]);
});