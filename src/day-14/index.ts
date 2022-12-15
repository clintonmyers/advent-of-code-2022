import fs from "fs/promises";
import path from "path";

/******************************/
/* Types                      */
/******************************/

type coord = [number, number];

type tile = "." | "#" | "+" | "o";

type direction = "u" | "d" | "l" | "r";

type Directions = {
  [dir in direction]: coord;
};

/******************************/
/* Interfaces                 */
/******************************/

interface Points {
  [point: string]: tile;
}

/******************************/
/* Constants                  */
/******************************/

const moves: Directions = {
  u: [0, -1],
  d: [0, 1],
  l: [-1, 0],
  r: [1, 0],
};

/******************************/
/* Variables                  */
/******************************/

const pts: Points = {};

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
    .split("\n")
    .map((x) =>
      x.split(" -> ").map((y) => y.split(",").map((z) => parseInt(z)) as coord)
    );
})();

const pt2str = (point: coord): string => `${point[0]},${point[1]}`;

const str2pt = (point: string): coord =>
  point.split(",").map((x) => parseInt(x)) as coord;

const getDir = (start: coord, end: coord): [direction | null, number] => {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];

  const ax = Math.abs(dx);
  const ay = Math.abs(dy);

  if (dx === 0 && dy === 0) return [null, 0];
  if (dx === 0) return dy > 0 ? ["d", ay] : ["u", ay];
  return dx > 0 ? ["r", ax] : ["l", ax];
};

const moveOne = (point: coord, dir: direction): coord => {
  let [x, y] = point;
  x += moves[dir][0];
  y += moves[dir][1];
  drawPt([x, y]);
  return [x, y];
};

const drawLine = (start: coord, end: coord) => {
  let [x, y] = [...start];
  drawPt(start);
  const [dir, moves] = getDir(start, end);
  for (let i = 0; i < moves; i++) {
    [x, y] = moveOne([x, y], dir as direction);
  }
};

const drawPt = (point: coord, char: tile = "#") => {
  pts[pt2str(point)] = char;
};

const fall = (start: coord): coord | null => {
  // An array of all documented y values in the vertical path of the sand
  const yArr = Object.keys(pts)
    .map((str) => str2pt(str))
    .filter((pt) => {
      return pt[0] === start[0] && pt[1] > start[1];
    })
    .map((x) => x[1]);

  if (!yArr.length) return null;

  const x = start[0];
  const y = Math.min(...yArr) - 1;

  return land([x, y]);
};

// Determines if the sand stays or moves
const land = (landing: coord): coord | null => {
  const [x, y] = landing;

  // Look at left diagonal first
  const leftCoord: coord = [x - 1, y + 1];
  const leftStr = pt2str(leftCoord);
  if (!pts[leftStr]) return fall(leftCoord);

  // Look at right diagonal second
  const rightCoord: coord = [x + 1, y + 1];
  const rightStr = pt2str(rightCoord);
  if (!pts[rightStr]) return fall(rightCoord);

  return landing;
};

const render = (xMin: number, xMax: number, yMin: number, yMax = 0) => {
  for (let i = yMax; i <= yMin; i++) {
    const arr: string[] = [];
    for (let j = xMin; j <= xMax; j++) {
      arr.push(pts[pt2str([j, i])] || ".");
    }
    console.log(arr.join(""));
  }
};

/******************************/
/* Part One                   */
/******************************/

export const partOne = async () => {
  const arr = await data;

  // Determining mins and maxes
  const flatArr = arr.flat();
  const flatX = flatArr.map((x) => x[0]);
  const flatY = flatArr.map((x) => x[1]);
  const xMin = Math.min(...flatX);
  const xMax = Math.max(...flatX);
  const yMin = Math.max(...flatY); // Represents lowest point and highest value

  // Draw all rock tiles
  arr.map((x) =>
    x.map((y, i, subArr) => {
      if (i === 0) return null;
      drawLine(subArr[i - 1], subArr[i]);
      return null;
    })
  );

  const start: coord = [500, 0];
  const startStr = pt2str(start);
  pts[startStr] = "+";

  const sand: coord = [500, 1];

  render(xMin, xMax, yMin);

  let count = 0;

  while (fall(sand) !== null) {
    drawPt(fall(sand) as coord, "o");
    render(xMin, xMax, yMin);
    count += 1;
  }

  return count;
};

/******************************/
/* Part Two                   */
/******************************/

export const partTwo = async () => {
  return "Uncomment code to see answer.";
};
