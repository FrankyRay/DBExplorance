// @ts-check
import { world, Player } from "@minecraft/server";

/**
 * Print the message to the player (all/specific) with tellraw command.
 *
 * @param {string} message
 * The message to print out.
 * @param {Player|string} target
 * Target of the message. Default all players
 * @param {string|null} prefix
 * Prefix message.
 *
 * @example
 * let message = "This is my message"
 * Print(message, "Player Name")
 */
export default function Print(message, target = "", prefix = null) {
  target instanceof Player
    ? target.tell(message)
    : target === ""
    ? world.say(message)
    : world.getPlayers({ name: target })[0].tell(message);
}
