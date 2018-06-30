const lighthouse = require('../src/lighthouse');

jest.setTimeout(20000);

const lighthouseOptions = {
  onlyCategories: [
    'performance'
  ]
};

module.exports = (host, testDescriptions) => {

  for (const testData of testDescriptions) {
    const description = `${testData.path} is quick`;

    test(description, async () => {
      const result = await lighthouse(host + testData.path, lighthouseOptions);
      const perfScore = result.lhr.categories.performance.score * 100;

      expect(perfScore).toBeGreaterThanOrEqual(testData.threshold);
    });
  }
};
