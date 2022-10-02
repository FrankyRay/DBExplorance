import { Player, world } from "mojang-minecraft";
import ParseCommand from "../../lib/CommandParsing";
import Print from "../../lib/Print.js";
import setTickTimeout from "../../lib/TickTimeout.js";
// Command File Extended
import CmdComp from "./CmdComponent.js";
import FunctionCommand from "./Functions.js";
import Item from "./BetterCommand/Item";
import Math from "./Math.js";
import Rawtext from "./Rawtext.js";

// Commands Data
const mainPrefix = "\\";
const commands = {
  help: {
    desc: `This is help command! (How dare you do '${mainPrefix}help help'?)`,
    func: commandHelp,
    desc: [`${mainPrefix}help [command]`],
  },
  test: {
    desc: "Testing some features with custom commands",
    func: commandTest,
    args: [`${mainPrefix}test [...args]`],
  },
  item: {
    desc: "Add/modify item(s) into player/world",
    func: Item,
    args: [
      `${mainPrefix}item give <item> [amount] [component]`,
      `${mainPrefix}item spawn <location> <item> [amount] [component]`,
    ],
  },
};

/**
 * Event `beforeChat` for handling custom command
 */
world.events.beforeChat.subscribe((eventChat) => {
  let { message, sender } = eventChat;

  // Check for message start with prefix
  if (message.startsWith(mainPrefix)) {
    // Cancel the message being sent
    eventChat.cancel = true;

    // Take the command and argument
    const [command, ...args] = ParseCommand(message.slice(1));

    // Run [CustomCommand] function
    commands[command]["func"](sender, args);
  }
});

/**
 * Testing some features with `test` command
 * @param {Player} player
 * @param {String} args
 */
function commandTest(player, args) {
  Print("There is no test for now!", player.name);
}

/**
 * Send description of command usage with `help` command
 * @param {Player} player
 * @param {String} args
 */
function commandHelp(player, args) {
  const command = args[0];

  let description = `${commands[command]["desc"]}\nArguments:`;
  for (const args of commands[command]["args"]) {
    description += "\n" + args;
  }

  Print(description);
}
