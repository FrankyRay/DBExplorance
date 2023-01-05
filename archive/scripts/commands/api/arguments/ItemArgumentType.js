import {
  Player,
  MessageSourceType,
  ItemType,
  ItemTypes,
} from "@minecraft/server";
import CommandException from "../Exceptions";
import Options, { creativeItem } from "../Options";

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
 * @return {ItemType|string} ItemType (item id if stringify == true)
 */
export default function itemArgumentType(value, argument, player) {
  const vanillaOnly = argument.options?.vanillaOnly ?? Options.item.vanillaOnly;
  const creativeMode =
    argument.options?.creativeMode ?? Options.item.creativeMode;
  const stringify = argument.options?.stringify ?? Options.item.stringify;
  const item = ItemTypes.get(value);

  // ERROR: Item is not found
  if (!item) {
    CommandException(player, `Item '${value}' is not found`);
  }

  // ERROR: Item must be vanilla
  if (
    value.includes(":") &&
    value.substring(0, value.indexOf(":")) !== "minecraft"
  ) {
    CommandException(player, `Item must be vanilla`);
  }

  // ERROR: Creative item to non-op player
  if (
    creativeItem.includes(value.replace("minecraft:", "")) &&
    !player.isOp()
  ) {
    CommandException(player, `You have no permission to use item '${value}'`);
  }

  return stringify ? item.id : item;
}
