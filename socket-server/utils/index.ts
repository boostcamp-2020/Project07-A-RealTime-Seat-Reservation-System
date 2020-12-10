const getKey = (id: string, key: string) => {
  return `${id}:${key}`;
};

const getExpireKey = (userId: string, scheduleId: string, seatId: string) => {
  return `${userId}:${scheduleId}:${seatId}`;
};

export { getKey, getExpireKey };
