import {
  world,
  system,
  MinecraftBlockTypes,
  BlockType,
  MinecraftEffectTypes,
  ItemTypes,
  ItemType,
  Player,
} from "@minecraft/server";
import Print from "../lib/Print";
import defaultOption from "./options";

class CustomCommand {
  // Command prefix
  prefix = "\\";
  // Help command prefix
  helpPrefix = "?";

  // List of command data
  #commands = [];

  // Argument type conversion function
  #argumentConvertType = {
    string: (plr, args, data) => this.#argumentStringType(plr, args, data),
    number: (plr, args, data) => this.#argumentNumberType(plr, args, data),
    boolean: (plr, args, data) => this.#argumentBooleanType(plr, args, data),
    object: (plr, args, data) => this.#argumentObjectType(plr, args, data),
    block: (plr, args, data) => this.#argumentBlockType(plr, args, data),
    item: (plr, args, data) => this.#argumentItemType(plr, args, data),
    effect: (plr, args, data) => this.#argumentEffectType(plr, args, data),
    location: (plr, args, data) => this,
  };

  constructor() {
    this.#chatEvent();
    this.#debugEvent();
  }

  /**
   * Construct custom chat command
   *
   * @param {String} name
   * Name (also identifier) of the command
   *
   * @param {String} desc
   * Description of the command
   *
   * @param {object[]} args
   * The arguments of the command
   *
   * @param {Function} callback
   * The function hanlder for the command
   */
  addCommand(name, desc, args, callback) {
    this.#commands.push({
      name: name,
      desc: desc,
      args: args,
      callback: callback,
    });
  }

  /**
   * Parsing command into an array of command arguments
   * (Inspired by @FrostIce482)
   *
   * @param {Player} player
   * Player's class
   *
   * @param {String} command
   * Raw command arguments
   *
   * @return {object} Object of command arguments
   */
  #parseArguments(player, command) {
    const groups = {
      "{": "}",
      "[": "]",
      '"': '"',
    };

    let commandData = [],
      argLocRot = [],
      commandArgs = {},
      arg = "",
      argIndex = 0,
      closingArray = [],
      closingChar = "";
    for (const char of command) {
      if (char in groups && closingChar != '"') {
        closingArray.push(groups[char]);
        closingChar = groups[char];
      } else if (char == closingChar) {
        closingArray.pop();
        closingChar = closingArray[closingArray.length - 1];
      } else if (char == " " && !closingChar) {
        if (!arg) continue;
        if (Object.keys(commandData).length === 0) {
          commandData =
            this.#commands.find((command) => command.name == arg) ??
            this.#errorCommand(`Command ${arg} is not found`);
          commandArgs.command = arg;
          commandArgs.args = {};
        } else if (
          (commandData.args[argIndex].type == "location" &&
            argLocRot.length < 3) ||
          (commandData.args[argIndex].type == "rotation" &&
            argLocRot.length < 2)
        ) {
          argLocRot.push(arg);
          arg = "";
          continue;
        } else if (argIndex >= commandData.args.length) {
          this.#errorCommand("Too many argument provided");
        } else if (
          commandData.args[argIndex].type == "location" ||
          commandData.args[argIndex].type == "rotation"
        ) {
          commandArgs.args[commandData.args[argIndex].name] =
            this.#argumentConvertType[commandData.args[argIndex].type](
              argLocRot,
              commandData.args[argIndex]
            );
          argIndex++;
        } else {
          commandArgs.args[commandData.args[argIndex].name] =
            this.#argumentConvertType[commandData.args[argIndex].type](
              arg,
              commandData.args[argIndex]
            );
          argIndex++;
        }

        arg = "";
        continue;
      }

      arg += char;
    }
    if (arg) {
      if (Object.keys(commandData).length === 0) {
        commandData =
          this.#commands.find((command) => command.name == arg) ??
          this.#errorCommand(`Command ${arg} is not found`);
        commandArgs.command = arg;
        commandArgs.args = {};
      } else if (argIndex >= commandData.args.length) {
        this.#errorCommand("Too many argument provided");
      } else if (
        commandData.args[argIndex].type == "location" ||
        commandData.args[argIndex].type == "rotation"
      ) {
        argLocRot.push(arg);
        commandArgs.args[commandData.args[argIndex].name] =
          this.#argumentConvertType[commandData.args[argIndex].type](
            argLocRot,
            commandData.args[argIndex]
          );
        argIndex++;
      } else {
        commandArgs.args[commandData.args[argIndex].name] =
          this.#argumentConvertType[commandData.args[argIndex].type](
            arg,
            commandData.args[argIndex]
          );
        argIndex++;
      }
    }

    if (argIndex < commandData.args.length) {
      for (let i = argIndex; i < commandData.args.length; i++) {
        if (commandData.args[i].default === undefined)
          this.#errorCommand(
            `Argument ${commandData.args[i].name} is required`
          );
        commandArgs.args[commandData.args[i].name] = this.#argumentConvertType[
          commandData.args[i].type
        ](commandData.args[i].default);
      }
    }
    return commandArgs;
  }

  /**
   * Argument string type converter
   *
   * @param {Player} plr
   * Player's class
   *
   * @param {string} arg
   * Arguments
   *
   * @param {object} data
   * Command argument's data
   *
   * @returns {string}
   */
  #argumentStringType(plr, arg, data) {
    if (arg.startsWith('"') && arg.endsWith('"')) arg = arg.slice(1, -1);

    if (
      arg.length < (data.option?.length?.min ?? defaultOption.string.length.min)
    ) {
      this.#errorCommand(
        `Argument ${data.name} string's length is too short (${arg.length} < ${
          data.option?.length?.min ?? defaultOption.string.length.min
        })`
      );
    }

    if (
      arg.length > (data.option?.length?.max ?? defaultOption.string.length.max)
    ) {
      this.#errorCommand(
        `Argument ${data.name} string's length is too long (${arg.length} > ${
          data.option?.length?.max ?? defaultOption.string.length.max
        })`
      );
    }

    return arg;
  }

  /**
   * Argument number type converter
   *
   * @param {Player} plr
   * Player's class
   *
   * @param {string} arg
   * Arguments
   *
   * @param {object} data
   * Command argument's data
   *
   * @returns {number}
   */
  #argumentNumberType(plr, arg, data) {
    const number = Number(arg);
    const numInt = Math.round(number);

    // ERROR: Not a valid number
    if (isNaN(number))
      this.#errorCommand(`Argument ${data.name} is not a valid number`, {
        key: "commands.generic.num.invalid",
        values: [arg],
      });

    // ERROR: Float instead of integer
    if (
      !(data.options?.float ?? defaultOption.number.float) &&
      number !== numInt
    )
      this.#errorCommand(
        `Argument ${data.name} type is float instead of integer`
      );

    // ERROR: Number < min
    if (number < (data.options?.range?.min ?? defaultOption.number.range.min))
      this.#errorCommand(
        `Argument ${data.name} value is too small (${number} < ${
          data.options?.min ?? -2_147_483_648
        })`,
        {
          key: "commands.generic.num.tooSmall",
          values: [number, data.options?.min ?? -2_147_483_648],
        }
      );

    // ERROR: Number > max
    if (number > (data.options?.range?.max ?? defaultOption.number.range.max))
      this.#errorCommand(
        `Argument ${data.name} value is too big (${number} > ${
          data.options?.max ?? 2_147_483_647
        })`,
        {
          key: "commands.generic.num.tooBig",
          values: [number, data.options?.max ?? 2_147_483_647],
        }
      );

    if (data.option?.stringify === undefined)
      return defaultOption.number.stringify ? "" + number : number;
    return data.option.stringify ? "" + number : number;
  }

  /**
   * Argument boolean type converter
   *
   * @param {Player} plr
   * Player's class
   *
   * @param {string} arg
   * Arguments
   *
   * @param {object} data
   * Command argument's data
   *
   * @returns {boolean}
   */
  #argumentBooleanType(plr, arg, data) {
    if (arg !== "true" || arg !== "false")
      this.#errorCommand(`Argument ${data.name} has invalid boolean value`, {
        key: "commands.generic.boolean.invalid",
        values: [arg],
      });
    return arg === "true";
  }

  /**
   * Argument object type converter
   *
   * @param {Player} plr
   * Player's class
   *
   * @param {string} arg
   * Arguments
   *
   * @param {object} data
   * Command argument's data
   *
   * @returns {object}
   */
  #argumentObjectType(plr, arg, data) {
    let argsData = {};
    try {
      argsData = JSON.parse(arg);
    } catch (err) {
      this.#errorCommand(`Error ${data.name}: ${err}\n${err.stack}`);
    }
    return argsData;
  }

  /**
   * Argument block type converter (BlockType class)
   *
   * @param {Player} plr
   * Player's class
   *
   * @param {string} arg
   * Arguments
   *
   * @param {object} data
   * Command argument's data
   *
   * @returns {BlockType}
   */
  #argumentBlockType(plr, arg, data) {
    const block = MinecraftBlockTypes.get(arg);
    if (!block)
      this.#errorCommand(`Argument ${data.name} has unknown block (${arg})`);
    return block;
  }

  /**
   * Argument item type converter (ItemType class)
   *
   * @param {Player} plr
   * Player's class
   *
   * @param {string} arg
   * Arguments
   *
   * @param {object} data
   * Command argument's data
   *
   * @returns {ItemType}
   */
  #argumentItemType(plr, arg, data) {
    const item = ItemTypes.get(arg);
    if (!item)
      this.#errorCommand(`Argument ${data.name} has unknown item (${arg})`);
    return item;
  }

  /**
   * Argument location type converter
   *
   * @param {Player} plr
   * Player's class
   *
   * @param {string[]} arg
   * Arguments
   *
   * @param {object} data
   * Command argument's data
   *
   * @returns {number[]}
   */
  #argumentLocationType(plr, arg, data) {}

  // #argumentEffectType(plr, arg, data) {
  //   const effect = MinecraftEffectTypes.forEach();
  //   return effect;
  // }

  /**
   * Send error output to player's chat and console.
   *
   * @param {String} message
   * Error message.
   *
   * @param {{ key: String, values: any[] }} locale
   * Send locale message (from `.lang` file)
   * to the player
   */
  #errorCommand(message, locale) {
    if (!locale) world.say(message);
    else {
      const rawtext = {
        rawtext: [
          {
            translate: locale.key,
            with: {
              rawtext:
                locale.values?.map((val) => {
                  return {
                    text: "" + val,
                  };
                }) ?? [],
            },
          },
        ],
      };
      world
        .getDimension("overworld")
        .runCommandAsync(`tellraw @a ${JSON.stringify(rawtext)}`);
    }
    throw message;
  }

  /**
   * Executing the command
   *
   * @param {Player} player
   * Player class who run the custom command
   *
   * @param {string} message
   * The message (raw command)
   */
  #executeCommand(player, message) {
    let data;
    if (message.startsWith(this.prefix))
      data = this.#parseArguments(
        player,
        message.substring(this.prefix.length)
      );

    this.#commands
      .find((command) => command.name == data.command)
      .callback(player, data);
  }

  /**
   * Event `<worldEvent>.beforeChat` to execute custom command
   * from the message and player
   */
  #chatEvent() {
    world.events.beforeChat.subscribe((eventChat) => {
      const { message, sender: player } = eventChat;
      // Cancel the message being sent
      eventChat.cancel = true;
      // Run the command
      this.#executeCommand(player, message);
    });
  }

  /**
   * Event `<systemEvent>.scriptEventReceive` for debugging the command
   *
   * Usage:
   * `/scriptevent debug:command <customCommand>`
   */
  #debugEvent() {
    system.events.scriptEventReceive.subscribe((eventScript) => {
      // Run when "debug:command" message ID was specify
      if (eventScript.id === "debug:command") {
        // Logs the info that the command ran with "/scriptevent" command
        console.log(
          `Custom command executed with '/scriptevent' command as ${eventScript.sourceType}\n${eventScript.message}`
        );
        // Run the command
        this.#executeCommand(eventScript.sourceType, eventScript.message);
      }
    });
  }
}

export default new CustomCommand();
