import fs from "fs/promises";
import path from "path";

/******************************/
/* Types                      */
/******************************/

type numOrArr = NestedArray | number;

/******************************/
/* Interfaces                 */
/******************************/

interface NestedArray extends Array<NestedArray | number> {}

/******************************/
/* Utils                      */
/******************************/

const getData = async () => {
  return await fs.readFile(path.resolve(__dirname, "./input.txt"), {
    encoding: "utf8",
  });
};

const data = (async () => {
  const data = await getData();
  return data
    .split("\n\n")
    .map((x) =>
      (x.split("\n") as [string, string]).map(
        (y) => JSON.parse(y) as NestedArray
      )
    ) as [NestedArray, NestedArray][];
})();

const compare = (left: numOrArr, right: numOrArr): boolean | null => {
  if (typeof left === "number" && typeof right === "number") {
    // Compare numbers directly
    if (left < right) return true;
    if (left > right) return false;
    if (left === right) return null;
  } else if (typeof left === "object" && typeof right === "object") {
    const [llen, rlen] = [left.length, right.length];
    const len = Math.min(llen, rlen);
    // Check each item until one side runs out
    for (let i = 0; i < len; i++) {
      const output = compare(left[i], right[i]);
      if (output !== null) return output;
    }
    // If no determination is made,
    // check to see which list is longer
    if (llen < rlen) return true;
    if (llen > rlen) return false;
    return null;
  } else {
    // Generate new array from number for direct array comparison
    const newArr: [numOrArr, numOrArr] = [left, right].map((x) =>
      typeof x === "number" ? [x] : x
    ) as [numOrArr, numOrArr];
    return compare(...newArr);
  }
  return null;
};

// Parent wrapper for compare to ensure a non-null result and NestedArrays only
const sortFunc = (left: NestedArray, right: NestedArray): number =>
  compare(left, right) ? -1 : 1;

/******************************/
/* Part One                   */
/******************************/
export const partOne = async () => {
  const arr = await data;
  const indexArr = arr.map((x, i) => {
    const answer = compare(...x);
    return answer ? i + 1 : null;
  });
  const filtered = indexArr.filter((y) => typeof y === "number") as number[];
  const answer = filtered.reduce((a, b) => a + b);
  return answer;
};

/******************************/
/* Part Two                   */
/******************************/
export const partTwo = async () => {
  const arr = await data;
  const flat: NestedArray[] = [[[2]], [[6]]];
  arr.map((x) => flat.push(...x));
  flat.sort(sortFunc);
  const indexArr = flat.map((x, i) => {
    switch (JSON.stringify(x)) {
      case "[[2]]":
        return i + 1;
      case "[[6]]":
        return i + 1;
      default:
        return null;
    }
  });
  const filtered = indexArr.filter((x) => x !== null) as [number, number];
  const answer = filtered[0] * filtered[1];
  return answer;
};
