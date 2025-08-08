export const defaults = {
  title: 'Страница',
};

export function mergeConfig(data, defaults) {
  return {
    title: data.title !== undefined ? data.title : defaults.title
  };
}