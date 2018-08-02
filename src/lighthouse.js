const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const fs = require('fs-extra');
const path = require('path');
const printMessage = require('print-message');
const reportPath = path.join(process.cwd(), 'reports');

// ignore HTTPS errors to get passed self-signed certificates
const puppeteerOptions = require('./config/puppeteer');
const lighthouseOptions = require('./config/lighthouse');

// pass any proxy settings through to browser
if (process.env.http_proxy) {
  puppeteerOptions.args['--proxy-server'] = process.env.http_proxy;
}

if (process.env.no_proxy) {
  puppeteerOptions.args['--proxy-bypass-list'] = process.env.no_proxy;
}

lighthouseOptions['output-path'] = reportPath;

// close browswer and spit out error
const bail = async (browser, error) => {
  await browser.close();
  console.error(error);

  return {};
};

const urlPath = (url) => {
  const pos = url.indexOf('/', 8);

  url = url.substring(pos);

  return url;
};

const runLighthouse = (url, root = '', options = {}) => {

  printMessage(['Running lighthouse audit against', ` -  ${url}`]);

  return (async () => {
    let result;
    const browser = await puppeteer.launch(puppeteerOptions);

    try {
      const page = await browser.newPage().catch((error) => {
        bail(browser, error);
      });

      await page.goto(url).catch((error) => {
        bail(browser, error);
      });

      await lighthouse(url, Object.assign({}, lighthouseOptions, options))
        .catch((error) => {
          bail(browser, error);
        })
        .then((results) => {
          const reportUrlPath = urlPath(url);
          const htmlReport = path.join(reportPath, root, reportUrlPath + '.html');
          const jsonReport = path.join(reportPath, root, reportUrlPath + '.json');

          const parentDir = path.dirname(htmlReport);

          fs.ensureDirSync(parentDir);

          fs.writeFileSync(htmlReport, results.report[0]);
          fs.writeFileSync(jsonReport, results.report[1]);

          result = {
            lhr: results.lhr,
            reportPaths: [
              htmlReport,
              jsonReport
            ]
          };

        });

    }
    finally {
      await browser.close();
    }

    return result;
  })();
};

module.exports = runLighthouse;
