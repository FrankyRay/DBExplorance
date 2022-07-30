// @ts-check
import { world } from "mojang-minecraft";

/**
 * Take the command's returned data
 * @param {import("mojang-minecraft").Player} player Player who run the command
 * @param {string} commands Command string
 */
export default function CmdComp(player, commands) {
  if (commands.startsWith("/")) commands = commands.replace("/", "");

  let comp = "";
  let error = false;
  try {
    let commandData = player.runCommand(commands);
    Object.keys(commandData).forEach((key) => {
      comp += `\n  §c${key} §7${typeof commandData[key]}§e: §r${
        typeof commandData[key] === "object"
          ? JSON.stringify(commandData[key])
          : commandData[key]
      }`;
    });
  } catch (err) {
    error = true;
    let commandDataErr = JSON.parse(err);
    Object.keys(commandDataErr).forEach((key) => {
      comp += `\n  §c${key} §7${typeof commandDataErr[key]}§e: §r ${
        typeof commandDataErr[key] === "object"
          ? JSON.stringify(commandDataErr[key])
          : commandDataErr[key]
      }`;
    });
  }

  let status = !error ? "§a[Success]§r" : "§c[Error]§r";
  return `Command Component Data ${status}: \nCommands: (§g${commands}§r) => {${comp}\n}`;
}
