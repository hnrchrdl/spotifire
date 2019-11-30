export default (items, n = 5) => {
  if (!items || !items.length) {
    return [];
  }
  let rndm = [];
  while (rndm.length < n) {
    const item = items[Math.floor(Math.random() * items.length)];
    rndm = Array.from(new Set([...rndm, item]));
  }
  return rndm;
};
