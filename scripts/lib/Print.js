// @ts-check
import { world } from "@minecraft/server";

/**
 * Print the message to the player (all/specific) with tellraw command.
 *
 * @param {string} message The message to print out.
 * @param {string} target Target of the message. Default all players
 * @param {string|null} prefix Prefix message.
 *
 * @example
 * let message = "This is my message"
 * Print(message, "Player Name")
 */
export default function Print(message, target = "@a", prefix = null) {
  // If target is player name and has space on it, add quote around it
  if (target.includes(" ") || !target.startsWith("@")) target = `"${target}"`;

  // Double quotes safety
  // @ts-ignore
  message = message.replaceAll('"', '\\"');

  // Send prefix for the messages
  // Example: [Info] <Message>
  if (prefix != null) {
    world
      .getDimension("overworld")
      .runCommand(
        `tellraw ${target} {"rawtext": [{"text": "[${prefix}] ${message}"}]}`
      );
    return;
  }

  // Send message if no prefix provided/null
  world
    .getDimension("overworld")
    .runCommand(`tellraw ${target} {"rawtext": [{"text": "${message}"}]}`);
}
