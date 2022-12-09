import fs from "fs/promises";
import path from "path";

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
  return data.split("\n").map((x: string) => x.split(" ") as [string, number]);
})();

type coord = [number, number];

interface Rope {
  knots: Knots;
  tail: number; // Identifies last Knot ID
  tailLocs: string[];
}

interface Knots {
  [id: number]: coord;
}

const rope1: Rope = {
  knots: {
    0: [0, 0],
    1: [0, 0],
  },
  tail: 1,
  tailLocs: ["0,0"],
};

const rope2: Rope = {
  knots: {
    0: [0, 0],
    1: [0, 0],
    2: [0, 0],
    3: [0, 0],
    4: [0, 0],
    5: [0, 0],
    6: [0, 0],
    7: [0, 0],
    8: [0, 0],
    9: [0, 0],
  },
  tail: 9,
  tailLocs: ["0,0"],
};

const headNearTail = ([hx, hy]: coord, [tx, ty]: coord): boolean =>
  withinOne(hx, tx) && withinOne(hy, ty);

const withinOne = (a: number, b: number): boolean => !(Math.abs(a - b) > 1);

const moveTailtoHead = ([hx, hy]: coord, [tx, ty]: coord): coord | null => {
  let newTx: number;
  let newTy: number;

  if (headNearTail([hx, hy], [tx, ty])) {
    return null;
  }
  hx > tx ? (newTx = tx + 1) : hx === tx ? (newTx = tx) : (newTx = tx - 1);
  hy > ty ? (newTy = ty + 1) : hy === ty ? (newTy = ty) : (newTy = ty - 1);
  return [newTx, newTy];
};

const moveHead = (rope: Rope, [dir, dist]: [string, number]): Rope => {
  const newRope = { ...rope };
  for (let i = 1; i <= dist; i++) {
    newRope.knots[0] = moveHeadOnce(newRope.knots[0], dir) as coord;
    for (let j = 1; j <= rope.tail; j++) {
      const newPos = moveTailtoHead(newRope.knots[j - 1], newRope.knots[j]);
      if (newPos) newRope.knots[j] = newPos;
      if (j === rope.tail) {
        newRope.tailLocs.push(newRope.knots[j].join(","));
      }
    }
  }
  return newRope;
};

const moveHeadOnce = ([x, y]: coord, dir: string): coord | null => {
  switch (dir) {
    case "U":
      return [x, y + 1];
    case "D":
      return [x, y - 1];
    case "L":
      return [x - 1, y];
    case "R":
      return [x + 1, y];
    default:
      console.error("ERROR: Head movement issue");
      return null;
  }
};

/******************************/
/* Part One                   */
/******************************/
export const partOne = async () => {
  const arr = await data;
  arr.map((x: [string, number]) => moveHead(rope1, x));
  const set = new Set(rope1.tailLocs);
  return set.size;
};

/******************************/
/* Part Two                   */
/******************************/
export const partTwo = async () => {
  const arr = await data;
  arr.map((x: [string, number]) => moveHead(rope2, x));
  const set = new Set(rope2.tailLocs);
  return set.size;
};
