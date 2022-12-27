import {
  Player,
  MessageSourceType,
  BlockType,
  MinecraftBlockTypes,
} from "@minecraft/server";
import CommandException from "../Exceptions";
import Options, { creativeBlock } from "../Options";

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
 * @return {BlockType|string} BlockType (block id if stringify == true)
 */
export default function blockArgumentType(value, argument, player) {
  const vanillaOnly =
    argument.options?.vanillaOnly ?? Options.block.vanillaOnly;
  const creativeMode =
    argument.options?.creativeMode ?? Options.block.creativeMode;
  const stringify = argument.options?.stringify ?? Options.block.stringify;
  const block = MinecraftBlockTypes.get(value);

  // ERROR: Block is not found
  if (!block) {
    CommandException(player, `Block '${value}' is not found`);
  }

  // ERROR: Block must be vanilla
  if (
    value.includes(":") &&
    value.substring(0, value.indexOf(":")) !== "minecraft"
  ) {
    CommandException(player, `Block must be vanilla`);
  }

  // ERROR: Creative block to non-op player
  if (
    creativeBlock.includes(value.replace("minecraft:", "")) &&
    !player.isOp()
  ) {
    CommandException(player, `You have no permission to use block '${value}'`);
  }

  return stringify ? block.id : block;
}
