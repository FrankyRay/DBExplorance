// @ts-check
import { Items, ItemStack, world } from "mojang-minecraft";
import { ModalFormData } from "mojang-minecraft-ui";
import CancelReason from "../../lib/CancelationReason.js";
import Print from "../../lib/Print.js";
import setTickTimeout from "../../lib/TickTimeout.js";
// Command File Extended
import CmdComp from "./CmdComponent.js";
import ItemGive from "./ItemGive.js";
import Math from "./Math.js";
import Rawtext from "./Rawtext.js";

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
      const form = new ModalFormData()
        .title("Test Form")
        .textField("Text Field", "Placeholder");

      form.show(player).then((response) => {
        // @ts-ignore
        if (response.canceled)
          // @ts-ignore
          return console.warn(CancelReason(response.cancelationReason));

        console.log(response.formValues[0]);
      });
      // Print("There is no test for now!", player.name);
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

    case "give":
      ItemGive(player, args);
      break;

    case "math":
      Math(args, player);
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
