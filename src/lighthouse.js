const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const fs = require('fs-extra');
const path = require('path');
const reportPath = path.join(process.cwd(), 'reports');

// ignore HTTPS errors to get passed self-signed certificates
const puppeteerOptions = require('./config/puppeteer');
const lighthouseOptions = require('./config/lighthouse');

lighthouseOptions['output-path'] = reportPath;

// close browswer and spit out error
const bail = async (browser, error) => {
  await browser.close();
  console.error(error);

  return {};
};

const urlPath = (path) => {
  const exp = new RegExp('(https|http|:|/)', ['g']);

  return path.replace(exp, '');
};

const runLighthouse = (url, options = {}) => {

  fs.ensureDirSync(reportPath);

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
          const htmlReport = path.join(reportPath, reportUrlPath + '.html');
          const jsonReport = path.join(reportPath, reportUrlPath + '.json');

          fs.writeFileSync(htmlReport, results.report[0], {mode: '777'});
          fs.writeFileSync(jsonReport, results.report[1], {mode: '777'});

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
