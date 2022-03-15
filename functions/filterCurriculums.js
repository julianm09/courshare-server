const filtering = (
  arr = [],
  config = {
    title: null,
    category: null,
  }
) => {
  const { title, category } = config;

  if (title || category) {
    const filtered_arr = arr.filter((o) => {
      var cond = true;

      if (title) {
        cond = cond && o["name"].toLowerCase().includes(title.toLowerCase());
      }

      if (category) {
        cond = cond && o["category"].includes(category);
      }

      return cond;
    });

    return filtered_arr;
  } else {
    return [];
  }
};

module.exports = { filtering };
