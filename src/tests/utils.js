const start = new Date();

function wait(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

function time() {
  return ((new Date() - start) / 1000).toFixed(2) + 's';
}

function windowSet(page, name, value) {
  return page.evaluateOnNewDocument(`
    Object.defineProperty(window, '${name}', {
      get() {
        return '${value}'
      }
    })
  `);
}

module.exports = {
  time,
  wait,
  windowSet,
};
