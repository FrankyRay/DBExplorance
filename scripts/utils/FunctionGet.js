// @ts-check ~ Checking possible error
import { Entity, ItemStack, Player, world } from "@minecraft/server"; // "@minecraft/server"

/**
 * Get player's or entity's score within certain scoreboard objectives
 *
 * @param {string | Player | Entity} target
 * Player's or Entity's class or name
 *
 * @param {string} objective
 * Objective's name/id
 *
 * @param {boolean} failsave
 * Return 0 if the player/entity doesn't have score (Default: `true`)
 *
 * @return {number} Return the score of the player/entity (`NaN` if the score not found and failsave to `false`)
 */
export function getScore(target, objective, failsave = true) {
  // Take the objective
  // @ts-ignore ~ Module doesn't have `.scoreboard` property
  let scoreboardObjective = world.scoreboard.getObjective(objective);
  try {
    // Return score from named player or fake players
    if (typeof target == "string") {
      return scoreboardObjective.getScore(
        // @ts-ignore
        scoreboardObjective
          .getParticipants()
          .find((v) => v.displayName == target)
      );
    }
    // Return score from Player/Entity class
    // @ts-ignore ~ Module doesn't have `.scoreboard` property
    return scoreboardObjective.getScore(target.scoreboard);
  } catch {
    // Return 0 if score is not found [failsave = true]
    if (failsave) return 0;

    // Return NaN if score is not found [failsave = false]
    return NaN;
  }
}

/**
 * Get all item's enchantment
 *
 * @param {ItemStack} item
 * The item's class
 *
 * @returns {{
 *  id: string;
 *  lvl: number;
 * }[]} Enchantment's id and lvl
 */
export function getEnchantments(item) {
  let enchant = item.getComponent("enchantments").enchantments;
  let encPos = enchant.next();
  let encList = [];

  while (!encPos.done) {
    if (enchant.hasEnchantment(encPos.value.type)) {
      let enc = enchant.getEnchantment(encPos.value.type);
      encList.push({ id: enc.type.id, lvl: enc.level });
    }
  }

  return encList;
}
