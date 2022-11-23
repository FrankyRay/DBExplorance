// @ts-check
import { world } from "@minecraft/server";

/**
 * Get score from scoreboard
 * @param {import("@minecraft/server").Entity|import("@minecraft/server").Player|string} target Scoreboard target/player
 * @param {string} objective Scoreboard objective
 * @param {boolean} failsave Return 0 [true]/Throw Error [false] if the entity was not there
 * @return {number} Score of the entity
 */
export default function GetScore(target, objective, failsave = true) {
  // Take the objective
  // @ts-ignore - Module doesn't have `.scoreboard` property
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
    // @ts-ignore - Module doesn't have `.scoreboard` property
    return scoreboardObjective.getScore(target.scoreboard);
  } catch {
    // Return 0 if score is not found [failsave = true]
    if (failsave) return 0;

    // Throw error if score is not found [failsave = false]
    throw Error(`Target has no score on objective "${objective}"`);
  }
}
