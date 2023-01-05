import { Player, MessageSourceType } from "@minecraft/server";
import CommandException from "../Exceptions";
import Options from "../Options";

/**
 * Object argument type checker
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
 * @return {object|string} Number (string if stringify == true)
 */
export default function objectArgumentType(value, argument, player) {
  const stringify = argument.options?.stringify ?? Options.object.stringify;
  let object;

  try {
    object = JSON.parse(value);
  } catch (error) {
    CommandException(
      player,
      `Failed to parse the object at argument ${argument.name}`
    );
  }

  return stringify ? JSON.stringify(object) : object;
}
