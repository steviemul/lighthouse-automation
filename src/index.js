#!/usr/bin/env node

const lighthouse = require('./lighthouse');
const opn = require('opn');
const fileUrl = require('file-url');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.info('Specify a url to test');
  process.exit(1);
}

const url = args[0];
const root = args[1] || '';

lighthouse(url, root).then((result) => {
  const htmlReport = result.reportPaths[0];
  const htmlReportUrl = fileUrl(htmlReport);

  opn(htmlReportUrl);
});

