import Ajv, { ValidationError } from "ajv/dist/2020";
import {
  Instance,
  Markdown,
  Report,
  Severity,
  Submission
} from "./types";

export const SCHEMA_VERSION_DEFAULT = "0.2.0";
export const SCHEMA_VERSIONS = ["0.3.0", "0.2.0", "0.1.0"];

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
 * If successul, null is returned, otherwise an array of
 * validation errors will be returned
 */
export const validateReport = (reportJson: Report, schema: JSON) => {
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
  return `${instance.content}\n\n*GitHub* : ${instance.loc.join(",")}`;
};

export const getSubmissionPartial = (submission: Submission, locCount: number, num: number) => {
  const sevCode = getSeverityCode(submission.severity);
  // Join each section of the partial with a newline delimiter
  return [
    `### [${sevCode}-${num}]<a name="${sevCode.toLowerCase()}-${num}"></a> ${submission.title}`,
    submission.description,
    `*There are ${locCount} instance(s) of this issue:*`,
    ...submission.instances.map(getInstancePartial)
  ].join("\n");
};

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
    array.push(`### ${sev} Risk Issues`);
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

  // For every submissions
  //-- Write an entry to the table of contents
  //-- Write an entry to its severity section

  for (const sub of report.findings) {
    // Total all the loc found across all instances of this submission
    const locCount = sub.instances.reduce((count: number, instance: Instance) => {
      return count + instance.loc.length;
    }, 0);

    //-- Write an entry to the table of contents
    const sevCode = getSeverityCode(sub.severity);
    const index = severityCount[sub.severity]++;
    tocSummaryArray.push(
      `| [[${sevCode}-${index}](#${sevCode.toLowerCase()}-${index})] | ${sub.title} | ${locCount}| ${sub.gasSavings ?? 0}|`
    );

    //-- Write an entry to its severity section
    severitySections[sub.severity].push(
      getSubmissionPartial(sub, locCount, index)
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

  // Append the footnote if we have it
  if (report.footnote) {
    partials.push(report.footnote);
  }

  // Join all the partials with newlines
  return partials.join("\n");
};
