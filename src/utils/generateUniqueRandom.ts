export const generateUniqueRandom = (maxNr: number, length: number, id: number) => {
  const uniqueNums: Set<number> = new Set();
  return function generate(): number[] {
    if (uniqueNums.size === length) {
      return Array.from(uniqueNums);
    }

    const random = Number((Math.random() * maxNr).toFixed()) + 1;

    if (random === id || random > maxNr) {
      return generate();
    }

    if (!uniqueNums.has(random)) {
      uniqueNums.add(random);
      return generate();
    }

    if (uniqueNums.size < length) {
      return generate();
    }

    return Array.from(uniqueNums);
  };
};

