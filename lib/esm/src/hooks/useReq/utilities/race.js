/**
 * Polyfill for Promise.race.
 */
const race = (promisesArray) => new Promise((resolve, reject) => {
    promisesArray.forEach((promise) => {
        Promise.resolve(promise)
            .then(resolve, reject)
            .catch(reject);
    });
});
export default race;
