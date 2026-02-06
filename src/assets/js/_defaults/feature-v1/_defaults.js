module.exports = {
  defaults: {
    description: 'Описание',
    icon: 'Перейти',
    title: 'Заголовок',
  },
  mergeConfig(data, defaults) {
    return {
      description: data.description !== undefined ? data.description : defaults.description,
      icon: data.icon !== undefined ? data.icon : defaults.icon,
      title: data.title !== undefined ? data.title : defaults.title,
    }
  },
};