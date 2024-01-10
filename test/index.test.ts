import t from "tap";

import { Report } from "../lib/types";

import {
  defaultVersion,
  renderReport,
  validateReport,
  schemas
} from "../lib";

let basic03Report:Report;
let basicReport:Report;
let invalidReport:Report;

void t.before(async () => {
  basicReport = (await import("./fixtures/json-reports/basic.json", {
    assert: { type: "json" }
  })).default as Report;
  invalidReport = (await import("./fixtures/json-reports/invalid.json", {
    assert: { type: "json" }
  })).default as Report;
  basic03Report = (await import("./fixtures/json-reports/0.3.0-basic.json", {
    assert: { type: "json" }
  })).default as Report;
});

void t.test("should render a basic report", (t) => {
  t.matchSnapshot(renderReport(basic03Report));
  t.end();
});

void t.test("should render a basic best bot report", (t) => {
  t.matchSnapshot(renderReport(basic03Report, "cool-bot"));
  t.end();
});

void t.test("should validate a good report", (t) => {
  t.equal(validateReport(basicReport, schemas["0.1.0"]), null);
  t.equal(validateReport(basicReport, schemas["0.2.0"]), null);
  t.equal(validateReport(basicReport, schemas["0.3.0"]), null);
  t.equal(validateReport(basic03Report, schemas["0.3.0"]), null);
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
    "instancePath": "/findings/1/instances/0/loc/1",
    "message": "must match pattern \"https:\\/\\/github\\.com\\/[^\\/]+\\/.*#L\\d+(-L\\d+)?\\)?$\""
  }, {
    "instancePath": "/findings/1/instances/0/loc",
    "message": "must NOT have more than 0 items"
  }, {
  // The following 1 errors are duplicated because of how the json schema anyOf works.
  // This will only occur when a bad link is present in the loc
    "instancePath": "/findings/1/instances/0/loc/1",
    "message": "must match pattern \"https:\\/\\/github\\.com\\/[^\\/]+\\/.*#L\\d+(-L\\d+)?\\)?$\""
  }, {
    "instancePath": "/findings/1/instances/0",
    "message": "must match a schema in anyOf"
  }, {
    "instancePath": "/findings/2/severity",
    "message": "must be equal to one of the allowed values"
  }, {
    "instancePath": "/findings/2/instances/0/loc/0",
    "message": "must match pattern \"https:\\/\\/github\\.com\\/[^\\/]+\\/.*#L\\d+(-L\\d+)?\\)?$\"",
  }, {
    "instancePath": "/findings/2/instances/0/loc/1",
    "message": "must match pattern \"https:\\/\\/github\\.com\\/[^\\/]+\\/.*#L\\d+(-L\\d+)?\\)?$\"",
  }, {
    "instancePath": "/findings/2/instances/0/loc/2",
    "message": "must match pattern \"https:\\/\\/github\\.com\\/[^\\/]+\\/.*#L\\d+(-L\\d+)?\\)?$\"",
  }, {
    "instancePath": "/findings/2/instances/0/loc",
    "message": "must NOT have more than 0 items",
  }, {
  // The following 3 errors are duplicated because of how the json schema anyOf works.
  // This will only occur when a bad link is present in the loc
    "instancePath": "/findings/2/instances/0/loc/0",
    "message": "must match pattern \"https:\\/\\/github\\.com\\/[^\\/]+\\/.*#L\\d+(-L\\d+)?\\)?$\"",
  }, {
    "instancePath": "/findings/2/instances/0/loc/1",
    "message": "must match pattern \"https:\\/\\/github\\.com\\/[^\\/]+\\/.*#L\\d+(-L\\d+)?\\)?$\"",
  }, {
    "instancePath": "/findings/2/instances/0/loc/2",
    "message": "must match pattern \"https:\\/\\/github\\.com\\/[^\\/]+\\/.*#L\\d+(-L\\d+)?\\)?$\"",
  }, {
    "instancePath": "/findings/2/instances/0",
    "message": "must match a schema in anyOf"
  }]);
  t.end();
});

void t.test("loc pattern should match valid urls", (t) => {
  const schema = schemas[defaultVersion];

  // Make sure all patterns for loc are set correctly and working
  for (const item of schema.properties.findings.items.properties.instances.items.anyOf) {
    if (!item.properties.loc.items.pattern) continue;

    const pattern = new RegExp(
      item.properties.loc.items.pattern
    );

    const goodLocs: string[] = [
      "[51](https://github.com/code-423n4/2022-01-dev-test-repo/blob/516099801101950ac9e1117a70e095b06f9bf6a1/asD/src/asD.sol#L51)",
      "[53](https://github.com/code-423n4/2022-01-dev-test-repo/blob/516099801101950ac9e1117a70e095b06f9bf6a1/asD/src/asD.sol#L53-L54)",
      "https://github.com/code-423n4/2022-01-dev-test-repo/blob/516099801101950ac9e1117a70e095b06f9bf6a1/asD/src/asD.sol#L55",
      "https://github.com/code-423n4/2022-01-dev-test-repo/blob/516099801101950ac9e1117a70e095b06f9bf6a1/asD/src/asD.sol#L55-L57"
    ];
    for (const loc of goodLocs) {
      t.equal(pattern.test(loc), true, loc);
    }

    const badLocs: string[] = [
      "[53](https://github.com/code-423n4/2022-01-dev-test-repo/blob/516099801101950ac9e1117a70e095b06f9bf6a1/asD/src/asD.sol#L53-54)",
      "[53](https://github.com/code-423n4/2022-01-dev-test-repo/blob/516099801101950ac9e1117a70e095b06f9bf6a1/asD/src/asD.sol#L53:L54)",
      "[53](https://github.com/code-423n4/2022-01-dev-test-repo/blob/516099801101950ac9e1117a70e095b06f9bf6a1/asD/src/asD.sol#L53:54)",
      "[53](https://github.com/code-423n4/2022-01-dev-test-repo/blob/516099801101950ac9e1117a70e095b06f9bf6a1/asD/src/asD.sol#53:54)",
      "[53](https://github.com/code-423n4/2022-01-dev-test-repo/blob/516099801101950ac9e1117a70e095b06f9bf6a1/asD/src/asD.sol)",
      "https://github.com/code-423n4/2022-01-dev-test-repo",
      "https://github.com/code-423n4/2022-01-dev-test-repo/blob/516099801101950ac9e1117a70e095b06f9bf6a1/asD/src/asD.sol",
      "github.com",
      "https://malicioussite.com/sneaky/hacks/hack.exe#L1",
      "https://malicioussite.co/sneaky/hacks#L1"
    ];
    for (const loc of badLocs) {
      t.equal(pattern.test(loc), false, loc);
    }
  }

  t.end();
});