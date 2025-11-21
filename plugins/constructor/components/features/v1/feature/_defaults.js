module.exports = {
  defaults: {
    link: {
      title: 'Заголовок',
      description: 'Описание',
      icon: 'Перейти',
    },
  },
  mergeConfig(data, defaults) {
    return {
      title: data.title !== undefined ? data.title : defaults.title,
      description: data.description !== undefined ? data.description : defaults.description,
      icon: data.icon !== undefined ? data.icon : defaults.icon,
    }
  },
};