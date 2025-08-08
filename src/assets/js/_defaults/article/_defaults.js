export const defaults = {
  link: {
    href: '#',
    target: false,
    title: '',
  },
};

export function mergeConfig(data, defaults) {
  return {
    href: data.link !== undefined ? data.link.href : defaults.link.href,
    target: data.link !== undefined ? data.link.target : defaults.link.target,
    title: data.link !== undefined ? data.link.title : defaults.link.title
  };
}