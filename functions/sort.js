function sortArr(
  arr = [],
  config = {
    key: null,
    type: null,
  }
) {
  const { key, type } = config;

  if (key) {
    arr.sort((cur, next) => {
      var num1 = Number(cur[key]);
      var num2 = Number(next[key]);

      if (isNaN(cur[key])) {
        num1 = cur[key];
        num2 = next[key];
      }

      if (num1 > num2) {
        if (type && type === "desc") {
          return -1;
        } else {
          return 1;
        }
      }
      if (num1 < num2) {
        if (type && type === "desc") {
          return 1;
        } else {
          return -1;
        }
      }

      return 0;
    });
    return arr;
  }
}


module.exports = { sortArr };
