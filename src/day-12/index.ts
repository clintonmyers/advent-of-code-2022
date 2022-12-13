import fs from "fs/promises";
import path from "path";

// HEADS UP, I coded this problem to start from the end and work backwards
// because it looked like it might be more efficient.

/******************************/
/* Types                      */
/******************************/

type coord = [number, number];

type direction = "u" | "d" | "l" | "r";

/******************************/
/* Interfaces                 */
/******************************/

interface Costs {
  [loc: string]: number;
}

interface Directions {
  [key: string]: coord;
}

interface Destination {
  point: coord;
  count: number;
}

/******************************/
/* Constants                  */
/******************************/

const directions: Directions = {
  u: [0, -1],
  d: [0, 1],
  l: [-1, 0],
  r: [1, 0],
};

const dirArr: direction[] = Object.keys(directions) as direction[];

const alpha = "abcdefghijklmnopqrstuvwxyz".split("");

/******************************/
/* Variables                  */
/******************************/

const costs: Costs = {};

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
  return data.split("\n").map((x) => x.split(""));
})();

const pt2str = (point: coord) => `${point[0]},${point[1]}`;

const str2pt = (str: string): coord =>
  str.split(",").map((x) => parseInt(x)) as coord;

const checkMoves = (start: coord, data: string[][]) => {
  const stack: Destination[] = [
    {
      point: start,
      count: 0,
    },
  ];
  while (stack.length) {
    dirArr.map((dir) => {
      const newPt = canMove(stack[0].point, dir, stack[0].count + 1, data);
      newPt ? stack.push({ point: newPt, count: stack[0].count + 1 }) : null;
    });
    stack.shift();
  }
};

const canMove = (
  start: coord,
  dir: direction,
  count: number,
  data: string[][]
): coord | false => {
  // Starting point
  const [sX, sY] = start;
  // Determine end point
  const [eX, eY] = [sX + directions[dir][0], sY + directions[dir][1]];
  // Determine max indices for data
  const [xMax, yMax] = [data[0].length - 1, data.length - 1];
  // Check if move is out of bounds
  if (eX > xMax || eY > yMax || eX < 0 || eY < 0) {
    return false;
  }
  // Check if climb is possible
  const sChar = data[sY][sX];
  const eChar = data[eY][eX];
  if (!checkClimb(sChar, eChar)) {
    return false;
  }
  // Check to see if it's been done cheaper
  if (!checkCost([eX, eY], count)) {
    return false;
  }
  // console.log(`[${eX} ,${eY}]: ${costs[`${eX},${eY}`]}`);
  generateOutput(data);

  return [eX, eY];
};

const generateOutput = (data: string[][]) => {
  const arr: string[][] = [];
  const xMax = data[0].length;
  const yMax = data.length;
  for (let i = 0; i < yMax; i++) {
    arr.push([]);
    for (let j = 0; j < xMax; j++) {
      const pt: coord = [j, i];
      const ptStr: string = pt2str([j, i]);
      let val = costs[ptStr] === undefined ? null : costs[ptStr];
      let char = val === null ? "." : val.toString();
      if (val && val >= 10) char = "X";
      arr[i].push(char);
    }
  }
  arr.map((x) => console.log(x.join("")));
};

// Determine if the climb for a given direction is possible
const checkClimb = (start: string, end: string): boolean => {
  const startI = getHeightIndex(start);
  const endI = getHeightIndex(end);
  return startI - endI <= 1;
};

// For height comparison, takes in a height character
// and returns a numeric value.
const getHeightIndex = (char: string): number => {
  switch (char) {
    case "E":
      return alpha.indexOf("z");
    case "S":
      return alpha.indexOf("a");
    default:
      return alpha.indexOf(char);
  }
};

// Checks to see if the point has ever been
// visited in less moves and keeps a record
// of the least moves required to visit a point
const checkCost = (point: coord, count: number): boolean => {
  // Create unique string key for costs object
  const [x, y] = point;
  const str = `${x},${y}`;
  // Check if key exists or if moves are at all time low and set value
  if (Object.keys(costs).indexOf(str) === -1 || count < costs[str]) {
    costs[str] = count;
    return true;
  }
  return false;
};

const generateArrayOfSingleHeight = (
  char: string,
  data: string[][]
): string[] => {
  const arr: string[] = [];
  const xMax = data[0].length;
  const yMax = data.length;
  for (let i = 0; i < yMax; i++) {
    for (let j = 0; j < xMax; j++) {
      if (char === data[i][j]) {
        arr.push(pt2str([j, i]));
      }
    }
  }
  return arr;
};

// Takes in a point and returns the minimum cost
const convertPointToCount = (point: coord): number => {
  const str = pt2str(point);
  return costs[str];
};

// Takes in a string array of points and returns the lowest count
const convertPointsToMinCount = (arr: string[]): number => {
  const countArr = arr.map((x) => costs[x]);
  return Math.min(...countArr);
};

/******************************/
/* Part One                   */
/******************************/
export const partOne = async () => {
  const arr = await data;

  // E starting point
  let sX = 0;
  let sY = 0;
  // $ end point
  let eX = 0;
  let eY = 0;

  const xMax = arr[0].length;
  const yMax = arr.length;
  const totalSize = xMax * yMax;

  // Get starting point for E
  arr.map((y, i, data) => {
    if (data[i].indexOf("E") !== -1) {
      sY = i;
      sX = data[i].indexOf("E");
    }
    if (data[i].indexOf("S") !== -1) {
      eY = i;
      eX = data[i].indexOf("S");
    }
  });

  console.log("here");
  console.log(sX, sY);
  costs[`${sX},${sY}`] = 0;

  generateOutput(arr);

  console.log("E");
  console.log(sX, sY);
  // 139 20
  console.log("S");
  console.log(eX, eY);
  // 0 20
  console.log(xMax, yMax);
  // 161 41

  checkMoves([sX, sY], arr);

  return costs[`${eX},${eY}`];
};

/******************************/
/* Part Two                   */
/******************************/
export const partTwo = async () => {
  // return convertPointsToMinCount('a');
  return 1;
};
