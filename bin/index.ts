#!/usr/bin/env ts-node

import { hideBin } from "yargs/helpers";
import yargs, { ArgumentsCamelCase } from "yargs";
import { Console } from "node:console";
import Path from "node:path";
import { readFile } from "node:fs/promises";

import { Report } from "../lib/types";
import {
  defaultVersion,
  schemas,
  validateReport,
  renderReport
} from "../lib/index";

const schemaVersions = Object.keys(schemas);
const print = new Console(process.stderr);

type Args = {
  report: string;
  schema: keyof typeof schemas;
  skip?: boolean;
};

const readReport = async (argv: Args): Promise<Report> => {
  const path = Path.resolve(argv.report);
  const rawFile = await readFile(path, { encoding: "utf-8" });
  let report;
  try {
    report = JSON.parse(rawFile) as Report;
  } catch (error) {
    print.error(`${argv.report} does not contain valid json. It must be fixed before retrying`);
    process.exit(1);
  }

  return report;
};

const validate = (argv: Args, report: Report) => {
  if (argv.schema !== defaultVersion) {
    print.warn(`WARNING: consider validating against ${defaultVersion} to avoid potential submission failures`);
  }
  if (!schemaVersions.includes(argv.schema)) {
    print.error(`${argv.schema} is not a valid version. Must be one of [${schemaVersions.join(", ")}].`);
    process.exit(1);
  }

  const schema = schemas[argv.schema];

  print.log(`Validating ${argv.report} against schema version ${argv.schema}`);
  const validationErrors = validateReport(report, schema);
  if (validationErrors) {
    const count:string = validationErrors.length === 100
      ? "100+"
      : validationErrors.length.toString();

    print.error(`The report has ${count} validation errors:`);
    print.error(JSON.stringify(validationErrors, null, 2));
    process.exit(1);
  }
};

void yargs(hideBin(process.argv))
  .command({
    command: "generate <report>",
    aliases: ["gen", "$0"],
    describe: "Converts the provided json report into markdown. The report will be validated before generation.",
    handler: async (argv: ArgumentsCamelCase<Args>) => {
      const report = await readReport(argv);
      validate(argv, report);
      print.log(`Validation successful, generating markdown...`);
      const reportOut = renderReport(report);
      process.stdout.write(reportOut);
    }
  })
  .command({
    command: "validate <report>",
    aliases: ["val"],
    describe: "Validates the projected json report against the Bot Race Schema.",
    handler: async (argv: ArgumentsCamelCase<Args>) => {
      const report = await readReport(argv);
      validate(argv, report);
      print.log(`Validation successful`);
    }
  })
  .positional("report", {
    describe: "The Bot Race json report"
  })
  .option("s", {
    array: false,
    description: "The schema version to validate against",
    default: defaultVersion,
    alias: "schema",
    choices: schemaVersions
  })
  .help()
  .version()
  .argv;