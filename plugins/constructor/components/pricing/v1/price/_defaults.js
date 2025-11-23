module.exports = {
  defaults: {
    tag: 'Tag',
    title: 'Заголовок',
    description: 'Описание',
    price: '$29',
    link: {
      href: '#',
      text: 'Link',
      target: '',
    },
    button: {
      href: '#',
      text: 'Link',
      target: '',
    },
    items: [
      {
        icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 5L21 12M21 12L14 19M21 12H3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        text: 'Text',
        idDisabled: false,
      }
    ]
  },
  mergeConfig(data, defaults) {
    return {
      tag: data.tag !== undefined ? data.tag : defaults.tag,
      title: data.title !== undefined ? data.title : defaults.title,
      description: data.description !== undefined ? data.description : defaults.description,
      price: data.price !== undefined ? data.price : defaults.price,
      items: data.items !== undefined && data.items.length > 0 ? data.items : defaults.items,
      link: data.link !== undefined ? data.link : defaults.link,
      button: data.button !== undefined ? data.button : defaults.button,
    }
  },
};