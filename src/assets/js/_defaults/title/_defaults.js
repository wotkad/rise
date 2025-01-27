module.exports = {
  defaults: {
    title: 'Страница',
  },
  mergeConfig(data, defaults) {
    return {
      title: data.title !== undefined ? data.title : defaults.title,
    }
  },
};