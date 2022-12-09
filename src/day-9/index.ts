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
  return data.split("\n").map((x: string) => x.split(" ") as move);
})();

type coord = [number, number];

type direction = "U" | "D" | "L" | "R";

type move = [direction, number];

interface Rope {
  knots: Knots;
  tail: number; // Identifies last Knot ID
  tailLocs: string[];
}

interface Knots {
  [id: number]: coord;
}

// Turns moves and knots into the number of unique tail locations
const generateTailLocQty = (moves: move[], knots = 2): number => {
  const tailLocs = moveRope(moves, knots).tailLocs;
  const uniqueTailLocs = new Set(tailLocs);
  return uniqueTailLocs.size;
};

// Starts with a fresh rope and outputs the final rope location
// including tail locations
const moveRope = (moves: move[], knots = 2): Rope => {
  const rope = { ...generateRope(knots) };
  moves.map((x: move) => moveHead(rope, x));
  return rope;
};

// Generates an initial rope of a certain size
const generateRope = (knots = 2): Rope => {
  const rope: Rope = {
    knots: {},
    tail: knots - 1,
    tailLocs: ["0,0"],
  };
  for (let i = 0; i < knots; i++) {
    rope.knots[i] = [0, 0];
  }
  return { ...rope };
};

// Checks if two points are close to each other
const headNearTail = ([hx, hy]: coord, [tx, ty]: coord): boolean =>
  withinOne(hx, tx) && withinOne(hy, ty);

const withinOne = (a: number, b: number): boolean => !(Math.abs(a - b) > 1);

// Moves the knot behind a moving knot if necessary
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

// Moves the head knot of the entire rope and triggers
// all cascading moves
const moveHead = (rope: Rope, [dir, dist]: move): Rope => {
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

const moveHeadOnce = ([x, y]: coord, dir: direction): coord | null => {
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
  return generateTailLocQty(arr);
};

/******************************/
/* Part Two                   */
/******************************/
export const partTwo = async () => {
  const arr = await data;
  return generateTailLocQty(arr, 10);
};
