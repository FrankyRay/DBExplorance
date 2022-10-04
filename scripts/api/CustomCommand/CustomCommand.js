import { Player, world } from "mojang-minecraft";
import ParseCommand from "../../lib/CommandParsing";
import Print from "../../lib/Print.js";
import setTickTimeout from "../../lib/TickTimeout.js";
// Command File Extended
import CmdComp from "./CmdComponent.js";
import FunctionCommand from "./Functions.js";
import Item from "./BetterCommand/Item";
import Math from "./Math.js";
import Rawtext from "./BetterCommand/Rawtext.js";

// Commands Data
const mainPrefix = "\\";
const helpPrefix = "?";
const commands = {
  help: {
    desc: `This is help command! (How dare you do '/help help'?)`,
    func: commandHelp,
    args: [`${mainPrefix}help [command: str]`],
  },
  test: {
    desc: "Testing some features with custom commands",
    func: commandTest,
    args: [`${mainPrefix}test [...args: any]`],
  },
  cmdcomp: {
    desc: "Take command data into content log",
    func: (player, args) => console.warn(CmdComp(player, args)),
    last: 1,
    args: [`${mainPrefix}cmdcomp <...command: str>`],
  },
  item: {
    desc: "Add/modify item(s) into player/world",
    func: Item,
    args: [
      `${mainPrefix}item give <item: str> [amount: int] [component: obj]`,
      `${mainPrefix}item spawn <location: vec3> <item: str> [amount: int] [component: obj]`,
    ],
  },
  math: {
    desc: "Math calculation inside Minecraft",
    func: Math,
    args: [
      `${mainPrefix}math eq <...equation: str>`,
      `${mainPrefix}math add <...numbers: int>`,
      `${mainPrefix}math multiply <...numbers: int>`,
    ],
  },
  msgdelay: {
    desc: "Send delayed message to all players",
    func: (_, args) => {
      setTickTimeout(() => {
        Print(args[1]);
      }, parseInt(args[0]));
    },
    last: 2,
    args: [`${mainPrefix}msgdelay <delay: int> [...message: str]`],
  },
  rawtext: {
    desc: "Send rawtext from '/tellraw' and '/titleraw' in simple way",
    func: Rawtext,
    last: 2,
    args: [`${mainPrefix}rawtext <...message: str>`],
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

    // Detecting the commands for check final arguments
    const _cmd = message.slice(
      mainPrefix.length,
      message.indexOf(" ") != -1 ? message.indexOf(" ") : undefined
    );

    // Take the command and argument
    const [command, ...args] = ParseCommand(
      message.slice(mainPrefix.length),
      commands[_cmd]?.last ?? -1
    );

    // Run the command
    commands[command]["func"](sender, args);
  } else if (message.startsWith(helpPrefix)) {
    // Cancel the message being sent
    eventChat.cancel = true;

    // Run the 'help' command
    commandHelp(sender, message.replace(helpPrefix, ""));
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
  console.log(JSON.stringify(command));

  if (!command)
    return Print(
      `List of working commands:\n${Object.keys(commands).join(", ")}`
    );

  let description = `${commands[command]["desc"]}\nArguments:`;
  for (const args of commands[command]["args"]) {
    description += "\n" + args.replace("\\", "\\\\");
  }

  // console.log(description);
  Print(description);
}
