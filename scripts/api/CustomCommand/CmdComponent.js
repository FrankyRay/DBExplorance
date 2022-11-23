// @ts-check
import { world } from "@minecraft/server";

/**
 * Take the command's returned data
 * @param {import("@minecraft/server").Player} player Player who run the command
 * @param {string} commands Command string
 */
export default function CmdComp(player, commands) {
  let command = commands[0];
  if (command.startsWith("/")) command = command.substring(1);

  let comp = "";
  let error = false;
  try {
    let commandData = player.runCommand(commands);
    Object.keys(commandData).forEach((key) => {
      let value = commandData[key];
      switch (typeof value) {
        case "object":
          value = JSON.stringify(value).replace("\n", "\\n");
          break;

        case "string":
          value = `"${value}"`;
          break;
      }

      comp += `\n  "${key}": ${value}`;
    });
  } catch (err) {
    error = true;
    let commandDataErr = JSON.parse(err);
    Object.keys(commandDataErr).forEach((key) => {
      let value = commandDataErr[key];
      switch (typeof value) {
        case "object":
          value = JSON.stringify(value).replace("\n", "\\n");
          break;

        case "string":
          value = `"${value}"`;
          break;
      }

      comp += `\n  "${key}": ${value}`;
    });
  }

  let status = !error ? "[Success]" : "[Error]";
  return `Command Component Data ${status}: \nCommands: (${commands}) => {${comp}\n}`;
}
