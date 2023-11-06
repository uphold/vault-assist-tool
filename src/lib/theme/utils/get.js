export const get = (object, path) => {
  if (!path || path.length === 0) {
    return;
  }

  return path.reduce((object, part) => object?.[part], object);
};
