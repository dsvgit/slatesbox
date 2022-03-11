export const getBulletedPointerContent = (depth: number) => {
  const pointers = ["●", "○", "■"];
  return pointers[depth % pointers.length];
};

export const getNumberedPointerContent = (depth: number, index: number) => {
  const converters = [String, intToLatin, intToRoman];
  return converters[depth % converters.length](index + 1).toLowerCase();
};

const intToLatin = (_num: any) => {
  const num = _num - 1; // start with 0
  const alphabetBased = num.toString(27); // 27 - letters count
  const length = alphabetBased.length;
  return alphabetBased
    .split("")
    .map((x, index) => {
      const charCode =
        index < length - 1 ? x.charCodeAt(0) - 1 : x.charCodeAt(0); // position correction (to start with 0)
      const convertedToLatin = charCode >= 97 ? charCode + 9 : charCode + 49; // convert 27-based numbers into latin counters notation
      return String.fromCharCode(convertedToLatin);
    })
    .join("");
};

const intToRoman = (num: number) => {
  const map: Record<string, number> = {
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1,
  };
  let result = "";

  for (const key in map) {
    const repeatCounter = Math.floor(num / map[key]);

    if (repeatCounter !== 0) {
      result += key.repeat(repeatCounter);
    }

    num %= map[key];

    if (num === 0) return result;
  }

  return result;
};
