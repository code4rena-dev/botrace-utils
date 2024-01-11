export const defaultVersion = "0.3.0";
export const schemas = {
  "0.1.0": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "Bot Report",
    "description": "Bot Race report schema",
    "type": "object",
    "properties": {
      "comment": {
        "description": "Optional comments that will be added in at the top of your report",
        "type": ["string", "null"]
      },
      "footnote": {
        "description": "Optional footnote that will be added in at the bottom of your report",
        "type": ["string", "null"]
      },
      "findings": {
        "description": "An array of all findings",
        "type": "array",
        "items": {
          "description": "",
          "type": "object",
          "properties": {
            "severity": {
              "description": "High | Medium | Low | Gas | Refactoring | NonCritical | Disputed",
              "type": "string"
            },
            "title": {
              "description": "Title of issue",
              "type": "string"
            },
            "description": {
              "description": "Description of issue",
              "type": "string"
            },
            "gasSavings": {
              "description": "Gas Savings",
              "type": ["number", "null"]
            },
            "category": {
              "description": "This is for making easier categorization of teh issue type",
              "type": ["string", "null"]
            },
            "instances": {
              "description": "An array of instances where the issues has occured, this can be seperated out for every instance or it can be used as a block of instances. The instance count will be generated from the loc.",
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "content": {
                    "description": "Content, code snippets, @audit tags, and the file would need to be. You may choose to stack all content for an individual file here as a block, or treat it as an individual instance. If you wish to treat these as seperate instances instead of a block of instances, and you want the file to be present for each instance, please ensure that you include this in the content of each issue.",
                    "type": "string"
                  },
                  "loc":{
                    "description": "links to the line of code",
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "minItems": 1
                  }
                },
                "required":["content", "loc"]
              },
              "minItems": 1
            }
          },
          "required": ["severity", "title", "description", "instances"]
        },
        "minItems": 1
      }

    },
    "required": [ "findings"]
  },
  "0.2.0": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "Bot Report",
    "description": "Bot Race report schema",
    "type": "object",
    "properties": {
      "comment": {
        "description": "Optional comments that will be added in at the top of your report",
        "type": ["string", "null"]
      },
      "footnote": {
        "description": "Optional footnote that will be added in at the bottom of your report",
        "type": ["string", "null"]
      },
      "findings": {
        "description": "An array of all findings",
        "type": "array",
        "items": {
          "description": "",
          "type": "object",
          "properties": {
            "severity": {
              "description": "High | Medium | Low | Gas | Refactoring | NonCritical | Disputed",
              "type": "string",
              "enum": ["High", "Medium", "Low", "Gas", "Refactoring", "NonCritical", "Disputed"]
            },
            "title": {
              "description": "Title of issue",
              "type": "string"
            },
            "description": {
              "description": "Description of issue",
              "type": "string"
            },
            "gasSavings": {
              "description": "Gas Savings",
              "type": ["number", "null"]
            },
            "category": {
              "description": "This is for making easier categorization of teh issue type",
              "type": ["string", "null"]
            },
            "instances": {
              "description": "An array of instances where the issues has occured, this can be seperated out for every instance or it can be used as a block of instances. The instance count will be generated from the loc.",
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "content": {
                    "description": "Content, code snippets, @audit tags, and the file would need to be. You may choose to stack all content for an individual file here as a block, or treat it as an individual instance. If you wish to treat these as seperate instances instead of a block of instances, and you want the file to be present for each instance, please ensure that you include this in the content of each issue.",
                    "type": "string"
                  },
                  "loc":{
                    "description": "links to the line of code",
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "minItems": 1
                  }
                },
                "required":["content", "loc"]
              },
              "minItems": 1
            }
          },
          "required": ["severity", "title", "description", "instances"]
        },
        "minItems": 1
      }

    },
    "required": [ "findings"]
  },
  "0.3.0": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "Bot Report",
    "description": "Bot Race report schema",
    "type": "object",
    "properties": {
      "comment": {
        "description": "Comments will be added in at the top of your report. Accepts plain strings or valid markdown.",
        "type": ["string", "null"]
      },
      "footnote": {
        "description": "Footnotes will be added in at the bottom of your report. Accepts plain strings or valid markdown.",
        "type": ["string", "null"]
      },
      "findings": {
        "description": "An array of all findings",
        "type": "array",
        "items": {
          "description": "",
          "type": "object",
          "properties": {
            "severity": {
              "description": "High | Medium | Low | Gas | Refactoring | NonCritical | Disputed",
              "type": "string",
              "enum": ["High", "Medium", "Low", "Gas", "Refactoring", "NonCritical", "Disputed"]
            },
            "title": {
              "description": "Title of issue. Accepts plain strings or valid markdown.",
              "type": "string"
            },
            "description": {
              "description": "Description of issue. Accepts plain strings or valid markdown.",
              "type": ["string", "null"]
            },
            "gasSavings": {
              "description": "Gas Savings.",
              "type": ["number", "null"]
            },
            "category": {
              "description": "This is for making easier categorization of the issue type",
              "type": ["string", "null"]
            },
            "instances": {
              "description": "An array of instances where the issues has occurred, this can be separated out for every instance or it can be used as a block of instances. The instance count will be generated from the loc.",
              "type": "array",
              "items": {
                "type": "object",
                "anyOf": [{
                  // Handle content being null, or both content and loc being set
                  "properties": {
                    "content": {
                      "type": ["string", "null"],
                      "description": "Supports markdown strings and is recommended to be formatted as a codeblock (starts and ends with ```). The field is optional as long as there is at least 1 entry in the loc array. It is recommended to only omit content, if the loc and instance description sufficiently describe the issue.",
                    },
                    "loc": {
                      "type": "array",
                      "description": "Links provided must be absolute github urls and include lines of code in the url hash. When referencing global issues or entire files, you may leave the loc array empty and use only the content field. If no links are provided, loc must be an empty array.",
                      "items": {
                        "type": "string",
                        "pattern": "https:\\/\\/github\\.com\\/[^\\/]+\\/.*#L\\d+(-L\\d+)?\\)?$"
                      },
                      "minItems": 1
                    }
                  },
                  "required": ["loc"]
                }, {
                  // Handle content being set and loc as an empty array
                  "properties": {
                    "content": {
                      "type": "string",
                      "description": "Supports markdown strings and is recommended to be formatted as a codeblock (starts and ends with ```). The field is optional as long as there is at least 1 entry in the loc array. It is recommended to only omit content, if the loc and instance description sufficiently describe the issue.",
                    },
                    "loc": {
                      "type": "array",
                      "description": "Links provided must be absolute github urls and include lines of code in the url hash. When referencing global issues or entire files, you may leave the loc array empty and use only the content field. If no links are provided, loc must be an empty array.",
                      "items": {
                        "type": "string",
                        "pattern": "https:\\/\\/github\\.com\\/[^\\/]+\\/.*#L\\d+(-L\\d+)?\\)?$"
                      },
                      "maxItems": 0
                    }
                  },
                  "required": ["content", "loc"]
                }]
              },
              "minItems": 1
            }
          },
          "required": ["severity", "title", "description", "instances"]
        },
        "minItems": 1
      }

    },
    "required": [ "findings"]
  }
};