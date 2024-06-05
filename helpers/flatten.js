export const flatten = args => {
  const keys = Object.keys(args);
  const result = {};

  keys.forEach(key => {
    const nestedKeys = Object.keys(args[key]);
    nestedKeys.forEach(nestedKey => {
      result[nestedKey] = args[key][nestedKey];
    });
  });

  return result;
};
