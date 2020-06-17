/**
 * Takes a promise, and returns then promised results in format [err, response]
 * @param { Promise } promise
 * @param { Object= } errorExt - Additional Information you can pass to the err object
 * @return { Promise }
 */
export const to = (promise, errorExt) => {
  return promise
    .then((data) => [null, data])
    .catch((err) => {
      if (errorExt) {
        Object.assign(err, errorExt);
      }

      return [err, undefined];
    });
};

export default to;
