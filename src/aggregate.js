#!/usr/bin/env node

const glob = require('glob');
const path = require('path');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.info('Specify a url to test');
  process.exit(1);
}

const root = path.join(process.cwd(), args[0]);

const jsonReports = glob.sync(root + '/**/*.json');

const METRICS = ['perfScore', 'fcp', 'fmp', 'si', 'ttfb', 'interactive', 'but'];

const scores = {};

METRICS.forEach((metric) => {
  scores[metric] = [];
});

jsonReports.forEach((jsonReport) => {
  const report = require(jsonReport);

  scores.perfScore.push(report.categories.performance.score * 100);
  scores.fcp.push(report.audits['first-contentful-paint'].rawValue);
  scores.fmp.push(report.audits['first-meaningful-paint'].rawValue);
  scores.si.push(report.audits['speed-index'].rawValue);
  scores.ttfb.push(report.audits['time-to-first-byte'].rawValue);
  scores.but.push(report.audits['bootup-time'].rawValue);
  scores.interactive.push(report.audits.interactive.rawValue);
});

METRICS.forEach((metric) => {
  scores[metric].sort();
});

const min = (values) => {
  return values[0];
};

const max = (values) => {
  return values[values.length - 1];
};

const avg = (values) => {
  const total = values.reduce((total, value) => {
    return total + value;
  });

  return total / values.length;
};

const percentile = (values, percentage) => {
  const index = (values.length / 100) * percentage;

  return values[Math.round(index)];
};

const report = {
  'samples': jsonReports.length,
  'metrics': {}
};

METRICS.forEach((metric) => {
  report.metrics[metric] = {
    'min': min(scores[metric]).toFixed(2),
    'max': max(scores[metric]).toFixed(2),
    'avg': avg(scores[metric]).toFixed(2),
    '90': percentile(scores[metric], 90).toFixed(2),
    '95': percentile(scores[metric], 95).toFixed(2),
    '99': percentile(scores[metric], 99).toFixed(2)
  };
});

console.log(report);
