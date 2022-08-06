// @ts-check
import { Items, ItemStack, world } from "mojang-minecraft";
import Print from "../../lib/Print.js";
import CmdComp from "./CmdComponent.js";
import ItemGive from "./ItemGive.js";
// Command File Extended
import Math from "./Math.js";

// Prefix command
const prefix = "\\";
const cmdDesc = {};

/**
 * Custom Command with Gametest. Using `beforeChat` event
 *
 * @param {string} command Custom command ID
 * @param {string} args Arguments of the command
 * @param {import("mojang-minecraft").Player} player Player running the command
 */
function CustomCommand(command, args, player) {
  // Switch the command
  switch (command) {
    // Help commands
    case "help":
      Print(
        "This is help command! (I'm lazy to give some desc to my help command)",
        player.name
      );
      break;

    // Testing some features with custom commands
    case "test":
      player.runCommand(
        'execute as @s run loot give @s loot "test/custom_sword"'
      );
      // Print("There is no test for now!", player.name);
      break;

    case "consc":
      let conscItem = new ItemStack(Items.get("stick"), 1, 0);
      conscItem.setLore(["§r§g[Console Commands UI]"]);

      // @ts-ignore
      player.getComponent("inventory").container.addItem(conscItem);
      break;

    case "cmdcomp":
      console.warn(CmdComp(player, args));
      break;

    case "itemgive":
      ItemGive(player, args);
      break;

    case "math":
      Math(args, player);
      break;

    case "tells":
      let regexRawtext = /(\<@\w(?:\[.*?\])?(?:\|\w+)?\>)/g;
      let messagePiece = args.split(regexRawtext);
      // console.warn(JSON.stringify(messagePiece));

      let rawtext = [];
      for (let msg in messagePiece) {
        if (!messagePiece[msg].startsWith("<")) {
          rawtext.push({ text: messagePiece[msg] });
        } else if (messagePiece[msg].indexOf("|") < 0) {
          rawtext.push({ selector: messagePiece[msg].replace(/[><]/g, "") });
        } else {
          let [target, obj] = messagePiece[msg].replace(/[><]/g, "").split("|");
          rawtext.push({ score: { name: target, objective: obj } });
        }
      }

      let cmd = `tellraw @a {"rawtext": ${JSON.stringify(rawtext)}}`;
      // console.warn(cmd);
      player.runCommand(cmd);
      break;

    // Error message when no command available
    default:
      Print(
        `The command "${prefix}${command}" was not available at the moment!`,
        player.name
      );
  }
}

/**
 * Event `beforeChat` for handling custom command
 */
world.events.beforeChat.subscribe((eventChat) => {
  let { message, sender } = eventChat;

  // Check for message start with prefix
  if (message.startsWith(prefix)) {
    // Cancel the message being sent
    eventChat.cancel = true;

    // Take the command and argument
    let command = message.split(" ")[0].replace(prefix, "");
    let argument = message.substring(message.indexOf(" ") + 1);

    // Run [CustomCommand] function
    CustomCommand(command, argument, sender);
  }
});