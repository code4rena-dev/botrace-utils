# Code4rena Botrace Utils

Various utilities for Code4rena Bot Races

## Getting Started
### Installation
Node.js 18 or higher is required.

Install via npm: `npm i -g @code4rena/botrace-utils`

Or use npx to run the package directly: `npx @code4rena/botrace-utils --help`

### Command line
#### Usage
Once installed the `c4bru` command will be available. See `c4bru --help` for full usage.

**JSON validation**
To validate a local file named `report.json`:
```
c4bru validate ./report.json
```

By default, this uses the currently recommended schema version. See the `--help` docs for how to change the target schema.

**Markdown Rendering**
You can generate Markdown from your JSON report as it will be rendered for Github.

_Note_: Prior to generating the markdown the JSON report will be run through validation.

```
c4bru ./report.json > report.md
```

### As a library