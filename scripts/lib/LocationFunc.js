import { Location, BlockLocation } from "mojang-minecraft";

/**
 * Return string location into `Location()` class
 * @param {string} location String consist 3 set of coordinate number
 * @returns {import("mojang-minecraft").Location} Location class
 */
export function StringToLocation(location) {
  let locList = location.split(" ").map((val) => parseInt(val));
  return new Location(locList[0], locList[1], locList[2]);
}

/**
 * Return string location into `BlockLocation()` class
 * @param {string} location String consist 3 set of coordinate number
 * @returns {import("mojang-minecraft").BlockLocation} BlockLocation class
 */
export function StringToBlockLocation(location) {
  let locList = location.split(" ").map((val) => parseInt(val));
  return new BlockLocation(locList[0], locList[1], locList[2]);
}
