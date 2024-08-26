// Generate a random number between 0 and 1 with 2 decimals. The function is idempotent if it detect the "seed" option.
const random = function (options = {}) {
  if (options.seed) {
    return (options.seed = ((options.seed * Math.PI * 100) % 100) / 100);
  } else {
    return Math.random();
  }
};

export { random };
