import Ajv, { ValidationError } from "ajv/dist/2020";
import { Report } from "./types";

export const SCHEMA_VERSION_DEFAULT = "0.2.0";
export const SCHEMA_VERSIONS = ["0.2.0", "0.1.0"];

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