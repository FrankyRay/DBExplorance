import {
  world,
  ScoreboardObjective,
  ScoreboardIdentity,
} from "@minecraft/server";

export default class ScoreUtility {}

ScoreUtility.Objectives = class ScoreObjective {
  /**
   * Create new scoreboard objectives
   *
   * @param {string} objective
   * Scoreboard objective ID
   *
   * @param {string} displayName
   * Name of scoreboard objective shown on sidebar
   *
   * @return {ScoreObjective}
   */
  static add(objective, displayName) {
    return world.scoreboard.addObjective(objective, displayName);
  }

  /**
   * Create new scoreboard objectives
   *
   * @param {string|ScoreObjective} objective
   * Scoreboard objective ID/Class
   *
   * @return {boolean}
   */
  static remove(objective) {
    return world.scoreboard.removeObjective(objective);
  }
};

ScoreUtility.Players = class ScorePlayer {
  WILDCARD_INT = {
    MIN: -2_147_483_648,
    MAX: 2_147_483_647,
  };

  /**
   * Test player's score based on specify range
   *
   * @param {string|ScoreboardIdentity} target
   * Score holder
   *
   * @param {string|ScoreboardObjective} objective
   * The objective to be tested
   *
   * @param {string|number} min
   * S
   * @param {string|number} max
   */
  static testScore(player, objective, min, max = WILDCARD_INT.MAX) {}
};
