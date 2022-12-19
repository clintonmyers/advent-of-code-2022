import fs from "fs/promises";
import path from "path";

/******************************/
/* Types                      */
/******************************/

type coord = [number, number];

/******************************/
/* Interfaces                 */
/******************************/

/******************************/
/* Constants                  */
/******************************/

/******************************/
/* Variables                  */
/******************************/

/******************************/
/* Utils                      */
/******************************/

const getData = async () => {
  return await fs.readFile(path.resolve(__dirname, "./input1.txt"), {
    encoding: "utf8",
  });
};

const data = (async () => {
  const data = await getData();
  return data.split("\n").map((x) => formatStr(x));
})();

const formatStr = (str: string): [coord, coord] => {
  const arr = str
    .replace("Sensor at x=", "")
    .replace("y=", "")
    .replace("closest beacon is at x=", "")
    .replace("y=", "")
    .replace(":", "")
    .replace(",", "")
    .split(" ")
    .map((x) => parseInt(x));
  return [
    [arr[0], arr[1]],
    [arr[2], arr[3]],
  ];
};

// Returns the two points on a specific row that represent the edges of detection
const findRangeX = (
  sensor: coord,
  beacon: coord,
  row: number
): coord | null => {
  const [sx, sy] = sensor;
  const [bx, by] = beacon;
  // Total steps from Sensor to Beacon
  const dist = Math.abs(sx - bx) + Math.abs(sy - by);

  // If sy is smaller value than row, If sy is higher position than row
  // The difference should be positive, Move down

  // dy is the displacement between the Row and Sensor
  const dy = row - sy;
  // absY is the distance between the Row and Sensor
  const absY = Math.abs(dy);

  if (absY > dist) {
    return null;
  }
  if (absY === dist) {
    return [sx, sx];
  }
  const dx = dist - absY;
  const absX = Math.abs(dx);

  const leftX = sx - absX;
  const rightX = sx + absX;

  const range: coord = [leftX, rightX];
  return range;
};

// Combine a new range with existing ranges
const integrateRange = (newRange: coord, data: coord[]): coord[] => {
  const toBeCombined: coord[] = [[...newRange]];
  const filtered = [...data].filter((x: coord) => {
    if (overRange(newRange, x)) return false;
    if (bothInRange([...newRange], x)) {
      toBeCombined.push(x);
      return false;
    }
    return true;
  });
  const combined: coord[] = [...filtered, combineRange(toBeCombined.flat())]
    .filter((x) => x !== null)
    // Convert from coord | null to null
    .map((x) => x as coord)
    .sort((a, b) => a[0] - b[0]);
  return combined;
};

// If a newRange encompasses another range entirely, return true
const overRange = (newRange: coord, range: coord) => {
  const [newX, newY] = newRange;
  const [x, y] = range;
  return newX <= x && newY >= y;
};

// Check if a value is inside the bounds of a range
const inRange = (value: number, range: coord): boolean => {
  return value >= range[0] && value <= range[1];
};

// Check if a range is inside the bounds of another range
// in preparation for combination.
const bothInRange = (newRange: coord, range: coord): boolean => {
  return inRange(newRange[0], range) || inRange(newRange[1], range);
};

// Combine ranges
const combineRange = (range: number[]): coord | null => {
  if (range.length < 2) return null;
  const newRange = range.sort((a, b) => a - b);
  const len = newRange.length;
  const last = len - 1;
  const answer: coord = [newRange[0], newRange[last]];
  return answer;
};

const cantBeHere = (data: [coord, coord][], row: number): coord[] => {
  return data
    .map((x) => findRangeX(...x, row))
    .filter((x) => x !== null)
    .map((x) => x as coord)
    .reduce((acc, y) => {
      return integrateRange(y, acc);
    }, [] as coord[]);
};

const tuningFreq = (point: coord): number => point[0] * 4000000 + point[1];

/******************************/
/* Part One                   */
/******************************/

export const partOne = async () => {
  const arr = await data;

  const ranges = cantBeHere(arr, 10);
  return ranges.map((x) => x[1] - x[0]).reduce((a, b) => a + b);
};

/******************************/
/* Part Two                   */
/******************************/

export const partTwo = async () => {
  return 2;
};
