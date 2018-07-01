# Lighthouse automation tool

Command line tool for quickly running Lighthouse (https://developers.google.com/web/tools/lighthouse/) against a url.

## Usage

Install the package globally to install the binary tool 'lh-cli'.

Alternatively, execute the main script in this package 'src/index.js.

  - lh-cli \<target-url\>
    ```bash
    lh-cli http://www.example.com
    ```

  - ./src/index.js \<target-url> 
    ```bash
    ./src/index.js http://www.example.com
    ```
  
  **Note that you need to include the protocol also.**

Lighthouse will run against the specified url. The produced report will open in your browser once complete.

## Using for automation testing.

You can create automation tests to assert the performance threshold against any url, as determined by lighthouse.

`yarn perf-test` will run a generic jest test which will utilise the test cases defined in test/suites.

See the test/suites folder for examples on how to create tests.

### Example

```javascript
{
  "base": "https://www.bbc.co.uk",
  "paths": [
    {
      "name": "news page is quick",
      "path": "/news",
      "threshold": 40
    },
    {
      "name": "weather page is quick",
      "path": "/weather",
      "threshold": 40
    }
  ]
}
```

## Docker container

The included Dockerfile will build a container to include headless chrome and run the performance tests.

### Build the container

```bash
docker build -t lighthouse-automation .
```

### Run the container

```bash
docker run lighthouse-automation
```

### Or use docker compose 
This will build the container if required and then run it.
```bash
docker-compose up 
```
## Reports

A Jest test report will be output to the reports directory, along with lighthouse reports for each url tested.

Lighthouse reports will be in json and html format.

### reports/test-report.html

![Sample Jest Report](/images/jestReport.png?raw=true "reports/test-report.html")

### Lighthouse html report

![Sample Lighthouse Report](/images/lighthouseReport.png?raw=true)