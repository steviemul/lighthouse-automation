# Lighthouse automation tool

Command line tool for quickly running Lighthouse (https://developers.google.com/web/tools/lighthouse/) against a url.

## Usage

Install the package globally to install the binary tool 'lh-cli'
Alternatively, execute the main script in this package 'src/index.js.

  - lh-cli \<target-url\> e.g. lh-cli www.example.com
  - ./src/index.js \<target-url> e.g. ./src/index www.example.com

Lighthouse will run against the specified url. The produced report will open in your browser once complete.

## Using for automation testing.

You can create automation tests to assert the performance threshold against any url, as determined by lighthouse.

See the test/ folder for examples on how to create tests.

### Example

```javascript
const runTests = require('./base');

runTests('http://www.example.com', [
  {
    name: 'Example home page is quick',
    path: '/home',
    threshold: 90
  }
]);
```

