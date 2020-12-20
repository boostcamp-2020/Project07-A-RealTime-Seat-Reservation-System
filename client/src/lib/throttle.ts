export const throttling = () => {
  let throttleCheck: Boolean | ReturnType<typeof setTimeout>;

  return {
    throttle(callback: Function, milliseconds: number) {
      if (!throttleCheck) {
        callback();
        throttleCheck = setTimeout(() => {
          throttleCheck = false;
        }, milliseconds);
      }
    },
  };
};
