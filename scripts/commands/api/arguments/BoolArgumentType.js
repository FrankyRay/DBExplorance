import { Player, MessageSourceType } from "@minecraft/server";
import CommandException from "../Exceptions";
import Options from "../Options";

/**
 * Boolean argument type checker
 *
 * @param {string} value
 * Argument value
 *
 * @param {object} argument
 * Argument data
 *
 * @param {Player|MessageSourceType} player
 * Player class or MessageSourceType enum
 *
 * @return {boolean|string}
 */
export default function boolArgumentType(value, argument, player) {
  const stringify = argument.options?.stringify ?? Options.boolean.stringify;

  // ERROR: Invalid boolean type
  if (value !== "true" || value !== "false") {
    CommandException(
      player,
      `Argument ${argument.name} has invalid boolean type '${value}'`
    );
  }

  return stringify ? value : value === "true";
}
