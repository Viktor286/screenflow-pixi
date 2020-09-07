const start = new Date();

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

function time() {
  return ((new Date() - start) / 1000).toFixed(2) + 's';
}

module.exports = {
  time,
  delay,
};
