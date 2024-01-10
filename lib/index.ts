import Ajv, { ValidationError } from "ajv/dist/2020";
import {
  Instance,
  Markdown,
  Report,
  Severity,
  Submission
} from "./types";

import {
  defaultVersion,
  schemas
} from "./schemas";
export * from "./schemas";

/**
 * Returns partial errors for the Bot Race json schema validation
 * to reduce the amount of noise users receive.
 */
const formatValidationErrors = (errors: ValidationError["errors"]) => {
  return errors.map(error => {
    return {
      instancePath: error.instancePath,
      message: error.message
    };
  });
};

/**
 * Validates the provided report against the given schema.
 * If successful, null is returned, otherwise an array of
 * validation errors will be returned
 */
export const validateReport = (reportJson: Report, schema: object = schemas[defaultVersion]) => {
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  const valid = validate(reportJson);
  if (!valid && validate.errors) {
    // limit to 100 errors
    return formatValidationErrors(
      validate.errors.slice(0, 100)
    );
  }
  return null;
};

const severity: Record<Severity, string> = {
  "High": "H",
  "Medium": "M",
  "Gas": "G",
  "Low": "L",
  "Refactoring": "R",
  "NonCritical": "N",
  "Disputed": "D",
};

export const getSeverityCode = (sev: Severity) => {
  return severity[sev] ? severity[sev] : sev.replace(/\s/g, "");
};

export const getInstancePartial = (instance: Instance) => {
  const partial = [];
  if (instance.content) {
    partial.push(`\n${instance.content}`);
  }
  if (instance.loc.length > 0) {
    partial.push(`\n*GitHub* : ${instance.loc.join(",")}`);
  }
  return partial.join("\n");
};

export const getSubmissionPartial = (submission: Submission, locCount: number, formattedIndex: string) => {
  const sevCode = getSeverityCode(submission.severity);
  // Join each section of the partial with a newline delimiter
  return [
    `### [${sevCode}-${formattedIndex}]<a name="${sevCode.toLowerCase()}-${formattedIndex}"></a> ${submission.title}`,
    submission.description,
    `*There are ${locCount} instance(s) of this issue:*`,
    ...submission.instances.map(getInstancePartial)
  ].join("\n");
};

/**
 * Renders the JSON formatted bot report to markdown. To render a winning report,
 * pass the name of the winning bot.
 *
 * It is strongly recommended to run `validateReport` on the JSON prior to rendering.
 * renderReport may not be backward compatible with older schema versions than default.
 *
 * @param report The JSON formatted bot report.
 * @param botName If included, the winning bot language will be included for this bot name
 * @returns A markdown formatted string
 */
export const renderReport = (report: Report, botName?: string) => {
  const severitySections: Record<Severity, Markdown[]> = {
    "High": [],
    "Medium": [],
    "Low": [],
    "NonCritical": [],
    "Gas": [],
    "Refactoring": [],
    "Disputed": [],
  };
  for (const [sev, array] of Object.entries(severitySections)) {
    array.push(`\n### ${sev} Risk Issues`);
  }

  const severityCount: Record<Severity, number> = {
    "High": 0,
    "Medium": 0,
    "Low": 0,
    "NonCritical": 0,
    "Gas": 0,
    "Refactoring": 0,
    "Disputed": 0,
  };

  // Table of Contents / Summary
  const tocSummaryArray: string[] = [
    `## Summary\n\n| |Issue|Instances| Gas Savings\n|-|:-|:-:|:-:|`,
  ];

  // Rendering files yields:
  // 1-Summary.md
  // n-<severity>-bot-report.md
  // footnotes-bot-report.md

  for (const sub of report.findings) {
    // Total all the loc found across all instances of this submission
    const locCount = sub.instances.reduce((count: number, instance: Instance) => {
      return count + instance.loc.length;
    }, 0);

    //-- Write an entry to the table of contents
    const sevCode = getSeverityCode(sub.severity);
    const index = ++severityCount[sub.severity];
    const formattedIndex = index < 10 ? `0${index}` : `${index}`;
    tocSummaryArray.push(
      `| [[${sevCode}-${formattedIndex}](#${sevCode.toLowerCase()}-${formattedIndex})] | ${sub.title} | ${locCount}| ${sub.gasSavings ?? 0}|`
    );

    //-- Write an entry to its severity section
    severitySections[sub.severity].push(
      getSubmissionPartial(sub, locCount, formattedIndex)
    );
  }

  // If there's a comment, prepend it to the summary
  if (report.comment) {
    tocSummaryArray.unshift(...[
      report.comment
    ]);
  }

  if (botName) {
    tocSummaryArray.unshift(...[
      "# Winning bot race submission",
      `This is the top-ranked automated findings report, from ${botName} bot. All findings in this report will be considered known issues for the purposes of your C4 audit.`
    ]);
  }

  // Assemble the partials
  const partials:string[] = [
    ...tocSummaryArray
  ];

  // Add all severties that have data
  for (const markdownArray of Object.values(severitySections)) {
    if (markdownArray.length === 0) continue;
    partials.push(...markdownArray);
  }

  // Append the footnote if we have it with extra space
  if (report.footnote) {
    partials.push(`\n${report.footnote}`);
  }

  // Join all the partials with newlines
  return partials.join("\n");
};
