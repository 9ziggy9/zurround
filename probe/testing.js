const testObj1 = {
  "frame-1": null,
  "frame-2": null,
  "frame-3": null,
  "frame-4": null,
  "frame-5": null,
  "frame-6": null,
  "frame-7": null,
};

const testObj2 = {
  "frame-3": null,
  "frame-6": null,
  "frame-5": null,
  "frame-1": null,
  "frame-2": null,
  "frame-7": null,
};

function findGap(obj) {
  const gapIdx = Object.keys(obj)
    .map(key => parseInt(key.split("-")[1])) // array of num field of id.
    .sort((a, b) => a - b)                   // sort in ascending order.
    .findIndex((idNo, arrIdx) => idNo !== arrIdx + 1); // find disordered id.
  return gapIdx !== -1
    ? `frame-${gapIdx + 1}`
    : `frame-${Object.keys(obj).length + 1}`;
}

console.log(findGap(testObj1));
console.log(findGap(testObj2));
console.log(findGap({}));
