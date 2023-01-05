import { Player, MessageSourceType } from "@minecraft/server";
import CommandException from "../Exceptions";
import Options from "../Options";

/**
 * Number argument type checker
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
 * @return {number|string} Number (string if stringify == true)
 */
export default function stringArgumentType(value, argument, player) {
  const isFloat = argument.options?.floatType ?? Options.number.floatType;
  const minValue = argument.options?.range?.min ?? Options.number.range.min;
  const maxValue = argument.options?.range?.max ?? Options.number.range.max;
  const stringify = argument.options?.stringify ?? Options.number.stringify;
  const number = Number(value);

  // ERROR: Invalid number value
  if (isNaN(number)) {
    CommandException(
      player,
      `Argument ${argument.name} has invalid number (${value})`,
      "commands.generic.num.invalid",
      [value]
    );
  }

  // ERROR: Value type is float instead of integer
  if (isFloat && number !== Math.round(number)) {
    CommandException(
      player,
      `Argument ${argument.name} type is float instead of integer`
    );
  }

  // ERROR: Value is too small
  if (number < minValue) {
    CommandException(
      player,
      `Argument ${argument.name} value is too small (${number} < ${minValue})`,
      "commands.generic.num.tooSmall",
      [number, minValue]
    );
  }

  // ERROR: Value is too big
  if (number > maxValue) {
    CommandException(
      player,
      `Argument ${argument.name} value is too big (${number} > ${maxValue})`,
      "commands.generic.num.tooBig",
      [number, maxValue]
    );
  }

  return stringify ? "" + number : number;
}
