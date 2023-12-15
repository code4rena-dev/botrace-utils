#!/usr/bin/env ts-node

import { hideBin } from "yargs/helpers";
import yargs, { ArgumentsCamelCase } from "yargs";
import { Console } from "node:console";
import Path from "node:path";
import { readFile } from "node:fs/promises";

import { Report } from "../lib/types";

import {
  SCHEMA_VERSION_DEFAULT,
  SCHEMA_VERSIONS,
  validateReport
} from "../lib/index";

const print = new Console(process.stderr);

type Args = {
  report: string;
  schema: string;
};

const validate = async (argv: Args) => {
  const path = Path.resolve(argv.report);
  const rawFile = await readFile(path, { encoding: "utf-8" });
  let report;
  try {
    report = JSON.parse(rawFile) as Report;
  } catch (error) {
    print.error(`${argv.report} does not contain valid json. It must be fixed before retrying`);
    process.exit(1);
  }

  if (argv.schema !== SCHEMA_VERSION_DEFAULT) {
    print.warn(`WARNING: consider validating against ${SCHEMA_VERSION_DEFAULT} to avoid potential submission failures`);
  }

  const schemaPath = Path.resolve(`./lib/schemas/${argv.schema}.json`);
  const schemaFile = await readFile(schemaPath, { encoding: "utf8" });
  const schema = JSON.parse(schemaFile) as JSON;

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
      await validate(argv);
      print.log(`Validation successful, generating markdown...`);
    }
  })
  .command({
    command: "validate <report>",
    aliases: ["val"],
    describe: "Validates the projected json report against the Bot Race Schema.",
    handler: async (argv: ArgumentsCamelCase<Args>) => {
      await validate(argv);
      print.log(`Validation successful`);
    }
  })
  .positional("report", {
    describe: "The Bot Race json report"
  })
  .option("s", {
    array: false,
    description: "The schema version to validate against",
    default: SCHEMA_VERSION_DEFAULT,
    alias: "schema",
    choices: SCHEMA_VERSIONS
  })
  .help()
  .version()
  .argv;