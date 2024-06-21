export function generateUuid() {
  if ('crypto' in window) {
    // return crypto.randomUUID()
  } else {
    // Public Domain/MIT
    let d = new Date().getTime(); //Timestamp
    let d2 = (performance && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        let r = Math.random() * 16; //random number between 0 and 16
        if (d > 0) {
          //Use timestamp until depleted
          r = (d + r) % 16 | 0;
          d = Math.floor(d / 16);
        } else {
          //Use microseconds since page-load if supported
          r = (d2 + r) % 16 | 0;
          d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
  }
}

export function generateNumbersBetween(start, end, count = 40) {
  const step = (end - start) / (count - 1);
  const numbers = [];
  for (let i = 0; i < count; i++) {
    numbers.push(parseFloat((start + i * step).toFixed(2)));
  }
  return numbers;
}

export function formatPrice(inputString) {
  // Remove any non-digit characters or more than one dot
  const numericString = inputString.replace(/[^\d.]+|(\..*)\./g, '$1');

  const stringWithoutSpaces = numericString.replace(/\s/g, '');

  if (stringWithoutSpaces) return `$${stringWithoutSpaces.trim()}`;
  return '';
}

export function sumArray(numbers) {
  return numbers.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
}
