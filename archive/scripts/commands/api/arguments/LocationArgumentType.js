import {
  Player,
  MessageSourceType,
  BlockLocation,
  Location,
  Vector,
} from "@minecraft/server";
import CommandException from "../Exceptions";
import Options from "../Options";

/**
 * Number argument type checker
 *
 * @param {object} value
 * Argument value
 *
 * @param {object} argument
 * Argument data
 *
 * @param {Player|MessageSourceType} player
 * Player class or MessageSourceType enum
 *
 * @return {BlockLocation|Location|Vector|object|string} One of those 3 location class or object (string if stringify == true)
 */
export default function locationArgumentType(value, argument, player) {
  const relativeValue =
    argument.options?.relativeValue ?? Options.location.relativeValue;
  const localValue =
    argument.options?.localValue ?? Options.location.localValue;
  const outputData =
    argument.options?.outputData ?? Options.location.outputData;
  let rawLocation = { x: 0, y: 0, z: 0 };

  for (const axis of Object.keys(rawLocation)) {
    if (!value[axis]) continue;

    if (value[axis].startsWith("~")) {
      if (!relativeValue)
        CommandException(
          player,
          `Argument ${argument.name} cannot use relative coordinate`
        );
      rawLocation[axis] = player.location.x + Number(value.substring(1));
    } else if (value[axis].startsWith("^")) {
      CommandException(
        player,
        "Any argument with location type cannot use local coordinate for now"
      );
    } else {
      rawLocation[axis] = Number(value);
    }
  }

  let newLocation;
  switch (outputData) {
    case "Location":
      newLocation = new Location(...Object.values(rawLocation));
      break;
    case "BlockLocation":
      newLocation = new BlockLocation(...Object.values(rawLocation));
      break;
    case "Vector":
      newLocation = new Vector(...Object.values(rawLocation));
      break;
    default:
      newLocation = rawLocation;
  }

  return stringify ? Object.values(rawLocation).join(" ") : newLocation;
}
