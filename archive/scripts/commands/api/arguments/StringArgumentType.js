import { Player, MessageSourceType } from "@minecraft/server";
import CommandException from "../Exceptions";
import Options from "../Options";

/**
 * String argument type checker
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
 * @return {string}
 */
export default function stringArgumentType(value, argument, player) {
  const minLength = argument.options?.length?.min ?? Options.string.length.min;
  const maxLength = argument.options?.length?.max ?? Options.string.length.max;

  // Delete quotes from value
  if (value.startsWith('"') && value.endsWith('"')) {
    value = value.substring(1, 1);
  }

  // ERROR: String length is too short
  if (value.length < minLength) {
    CommandException(
      player,
      `Argument ${argument.name} is too short (${value.length} chars < ${minLength} chars)`
    );
  }

  // ERROR: String length is too long
  if (value.length > maxLength) {
    CommandException(
      player,
      `Argument ${argument.name} is too long (${value.length} chars > ${maxLength} chars)`
    );
  }

  return value;
}
