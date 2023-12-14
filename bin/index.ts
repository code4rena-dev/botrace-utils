#!/usr/bin/env ts-node

import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";
import {
  SCHEMA_VERSION_DEFAULT,
  SCHEMA_VERSIONS
} from "../lib/index";

void yargs(hideBin(process.argv))
  .command({
    command: "generate <report>",
    aliases: ["gen", "$0"],
    describe: "Converts the provided json report into markdown. The report will be validated before generation.",
    handler: (argv) => {
      console.log("args", argv);
    }
  })
  .command({
    command: "validate <report>",
    describe: "Validates the projected json report against the Bot Race Schema.",
    handler: (argv) => {
      console.log("args", argv);
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