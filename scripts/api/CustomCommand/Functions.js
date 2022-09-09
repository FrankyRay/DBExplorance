import { world } from "mojang-minecraft";
import Print from "../../lib/Print";

/**
 * Function command
 * @param {import("mojang-minecraft").Player} player
 * @param {String} args
 */
export default function FunctionCommand(player, args) {
  let mode = args.split(" ")[0];
  let name = args.split(" ")[1];
  let commandArray = args.substring(args.indexOf("[")) ?? [];

  switch (mode) {
    case "add":
      if (commandArray == "[]") return Print("Command array cannot be empty");
      player.addTag(`BtrCmd_Funcion:${name}:${commandArray}`);
      break;

    case "remove":
      player.removeTag(
        player.getTags().find((tag) => tag.startsWith(`BtrCmd_Funcion:${name}`))
      );
      break;

    case "run":
      let commandList = player
        .getTags()
        .find((tag) => tag.startsWith(`BtrCmd_Funcion:${name}`));

      if (!commandList) return Print(`Function "${name}" didn't exist`);

      let commands = commandList.replace(`BtrCmd_Funcion:${name}:`, "");
      for (let command of JSON.parse(commands)) {
        player.runCommand(command);
      }
      break;
  }
}
