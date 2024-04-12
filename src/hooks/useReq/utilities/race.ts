/**
 * Polyfill for Promise.race.
 */
const race = <T>(promisesArray: Promise<T>[]): Promise<T> =>
  new Promise((resolve, reject) => {
    promisesArray.forEach((promise) => {
      Promise.resolve(promise)
        .then(resolve, reject)
        .catch(reject);
    });
  });

export default race;
