// @ts-nocheck
// All import change ("../" => "../../scrips/")
import { Items, ItemStack, world } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import CancelReason from "../../scripts/lib/CancelationReason.js";
import Print from "../../scripts/lib/Print.js";
import setTickTimeout from "../../scripts/lib/TickTimeout.js";
// Command File Extended
import CmdComp from "../../scripts/api/CustomCommand/CmdComponent.js";
import FunctionCommand from "../../scripts/api/CustomCommand/Functions.js";
import Item from "../../scripts/api/CustomCommand/BetterCommand/Item";
import Math from "../../scripts/api/CustomCommand/Math.js";
import Rawtext from "../../scripts/api/CustomCommand/BetterCommand/Rawtext.js";

// Prefix command
const prefix = "\\";
const cmdDesc = {};

/**
 * Custom Command with Gametest. Using `beforeChat` event
 *
 * @param {string} command Custom command ID
 * @param {string} args Arguments of the command
 * @param {import("@minecraft/server").Player} player Player running the command
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
      Print("There is no test for now!", player.name);
      break;

    case "consc":
      let conscItem = new ItemStack(Items.get("stick"), 1, 0);
      conscItem.setLore(["§r§g[Console Commands UI]"]);

      // @ts-ignore
      player.getComponent("inventory").container.addItem(conscItem);
      break;

    case "console":
      console.log("Console Log");
      console.warn("Console Warn");
      console.error("Console Error");
      break;

    case "cmdcomp":
      console.warn(CmdComp(player, args));
      break;

    case "function":
      FunctionCommand(player, args);
      break;

    case "item":
      Item(player, args);
      break;

    case "math":
      Math(player, args);
      break;

    case "msgdelay":
      let delay = args.split(" ")[0];
      let message = args.substring(args.indexOf(" ") + 1);
      setTickTimeout(() => {
        Print(message);
      }, parseInt(delay));
      break;

    case "rawtext":
      Rawtext(player, args);
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
