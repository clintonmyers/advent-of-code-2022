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

type coord = [number, number];

const tailLocs: string[] = ["0,0"];

let [hx, hy] = [0, 0];
let [tx, ty] = [0, 0];

const headNearTail = (): boolean => withinOne(hx, tx) && withinOne(hy, ty);

const withinOne = (a: number, b: number): boolean => !(Math.abs(a - b) > 1);

const moveTailtoHead = () => {
  if (headNearTail()) {
    console.log("Tail is close.");
    return;
  }
  hx > tx ? (tx += 1) : hx === tx ? 0 : (tx -= 1);
  hy > ty ? (ty += 1) : hy === ty ? 0 : (ty -= 1);
  tailLocs.push(`${tx},${ty}`);
  console.log(`Tail is moving:       [${tx}, ${ty}]`);
};

const moveHead = ([dir, dist]: [string, number]) => {
  for (let i = 1; i <= dist; i++) {
    moveHeadOnce(dir);
    moveTailtoHead();
  }
};

const moveHeadOnce = (dir: string) => {
  let direction: string = "";
  switch (dir) {
    case "U":
      direction = "up   ";
      hy += 1;
      break;
    case "D":
      direction = "down ";
      hy -= 1;
      break;
    case "L":
      direction = "left ";
      hx -= 1;
      break;
    case "R":
      direction = "right";
      hx += 1;
      break;
  }
  // console.log(`Head is moving ${direction}: [${hx}, ${hy}]`);
};

const data = (async () => {
  const data = await getData();
  return data.split("\n").map((x: string) => x.split(" ") as [string, number]);
})();

/******************************/
/* Part One                   */
/******************************/
export const partOne = async () => {
  const arr = await data;
  console.log(arr);
  arr.map((x: [string, number]) => moveHead(x));
  const set = new Set(tailLocs);
  console.log(tailLocs);
  return set.size;
};

/******************************/
/* Part Two                   */
/******************************/
export const partTwo = async () => {
  return 1;
};
