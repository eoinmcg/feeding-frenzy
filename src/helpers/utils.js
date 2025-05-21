/**
 * Collection of small functions to make life easier
 * 
 */
export const Helpers = {
  /**
  * generates a random number
  * 
  * @param {number} min
  * @param {number} max
  * @param {mixed} type returns 'odd' or 'even' numbers, if specified
  * @returns {number}
  */
  rnd(min, max, type = false) {
    // Swap if min is greater than max
    if (min > max) [min, max] = [max, min];

    // Normalize type to lowercase
    type = typeof type === 'string' ? type.toLowerCase() : false;

    const isValidType = (num) => {
      if (type === 'odd') return num % 2 !== 0;
      if (type === 'even') return num % 2 === 0;
      return true;
    };

    // Filter valid numbers first to avoid infinite loop
    const candidates = [];
    for (let i = min; i <= max; i++) {
      if (isValidType(i)) candidates.push(i);
    }

    if (candidates.length === 0) {
      throw new Error(`No valid ${type || 'any'} numbers in the range ${min} to ${max}`);
    }

    const index = Math.floor(Math.random() * candidates.length);
    return candidates[index];
  },

  /**
  * plucks random value from array
  * 
  * @param {arrary} a
  * @returns {mixed}
  */
  rndArray: function (a) {
    return a[~~(Math.random() * a.length)];
  },

  /**
  * clamps number in range
  * 
  * @param {number} min
  * @param {number} max
  * @returns {number}
  */
  clamp: function(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }
};
