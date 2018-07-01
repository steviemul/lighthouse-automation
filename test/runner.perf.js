const glob = require('glob');
const path = require('path');
const lighthouse = require('../src/lighthouse');

jest.setTimeout(30000);

const lighthouseOptions = {
  onlyCategories: [
    'performance'
  ]
};

const suitesLocation = path.join(process.cwd(), 'test/suites');
const suites = glob.sync(suitesLocation + '/*.json');

suites.forEach((suite) => {
  const config = require(suite);

  const baseUrl = config.base || process.env.BASE_URL;

  if (!baseUrl) {
    throw new  Error(`No base url specified for suite ${suite}`);
  }

  describe(`${baseUrl} Performance test`, () => {

    const paths = config.paths;

    paths.forEach((pathSpec) => {

      const description = `${pathSpec.path} is quick`;

      it(description, async () => {
        const result = await lighthouse(baseUrl + pathSpec.path, lighthouseOptions);
        const perfScore = result.lhr.categories.performance.score * 100;

        expect(perfScore).toBeGreaterThanOrEqual(pathSpec.threshold);
      });
    });
  });
});

