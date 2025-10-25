module.exports = {
  defaults: {
    link: {
      href: '#',
      target: '',
      title: '',
    },
  },
  mergeConfig(data, defaults) {
    return {
      href: data.href !== undefined ? data.href : defaults.href,
      target: data.target !== undefined ? data.target : defaults.target,
      title: data.title !== undefined ? data.title : defaults.title,
    }
  },
};