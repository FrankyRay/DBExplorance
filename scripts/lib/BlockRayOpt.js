// @ts-check
import { world, BlockRaycastOptions } from "@minecraft/server";

/**
 * Simple BlockRaycastOptions function
 * @param {number} distance Distance of block raycast
 * @param {boolean} passable Stop when passable block on the distance
 * @param {boolean} liquid Stop when liquid block on the distance (Need passable set to `true`)
 */
export default function NewBlockRaycastOpt(
  distance = 10,
  passable = false,
  liquid = false
) {
  const bro = new BlockRaycastOptions();
  bro.includeLiquidBlocks = liquid;
  bro.includePassableBlocks = passable;
  bro.maxDistance = distance;
}
