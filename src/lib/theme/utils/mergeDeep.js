export const mergeDeep = (obj1, obj2) => {
  const result = { ...obj1, ...obj2 };

  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);

  const repeatedKeys = obj1Keys.filter(key => obj2Keys.includes(key));

  repeatedKeys.forEach(key => {
    const value1 = obj1[key];
    const value2 = obj2[key];

    if (typeof value1 === 'object' && typeof value2 === 'object' && !Array.isArray(value1) && !Array.isArray(value2)) {
      result[key] = mergeDeep(value1, value2);
    } else {
      // If the value is not an object we cannot merge
      // By default we use the first value
      result[key] = value1 || value2;
    }
  });

  return result;
};
