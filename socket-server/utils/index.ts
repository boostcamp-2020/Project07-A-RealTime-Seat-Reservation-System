const getKey = (id: string, key: string) => {
  return `${id}:${key}`;
};

const getExpireKey = () => {};

export { getKey, getExpireKey };
