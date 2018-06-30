const runTests = require('./base');

const host = process.env.TARGET_HOST;

if (!host) {
  throw new Error('Environment variable TARGET_HOST not set');
}

runTests(host, [
  {
    name: 'home page is quick',
    path: '/home',
    threshold: 90
  },
  {
    name: 'category page is quick',
    path: '/gift-shop/category/cat50056',
    threshold: 90
  },
  {
    name: 'category home page is quick',
    path: '/for-the-home/category/homeStoreRootCategory',
    threshold: 90
  },
  {
    name: 'product page is quick',
    path: '/acadia-wood-chair/product/xprod2148',
    threshold: 90
  }
]);

