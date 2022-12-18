import {
  world,
  system,
  MinecraftBlockTypes,
  MinecraftEffectTypes,
  ItemTypes,
} from "@minecraft/server";
import Print from "../lib/Print";

class CustomCommand {
  // Command prefix
  prefix = "\\";
  // Help command prefix
  helpPrefix = "?";

  // Valid argument types
  // argsType = ["string", "number", "boolean", "object", "location"];

  // List of command data
  commands = [];

  constructor() {
    this.#run();
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
    this.commands.push({
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
   * @param {String} command
   * The command arguments
   *
   * @param {Number} lastArgument
   * Return whole last command as string based of position of argument.
   * Default is `0` (No last argument).
   *
   * @return {object} Object of command arguments
   */
  #parseArguments(command, lastArgument = 0) {
    const groups = {
      "{": "}",
      "[": "]",
      '"': '"',
    };

    let commandArgs = [],
      arg = "",
      escChar = false,
      closingArray = [],
      closingChar = "",
      stringIndex = 0; // No question about this
    for (const char of command) {
      if (commandArgs.length === lastArgument && lastArgument > 0) {
        commandArgs.push(command.slice(stringIndex).trim());
        break;
      } else if (escChar) {
        escChar = false;
      } else if (char == "\\") {
        escChar = true;
        continue;
      } else if (char in groups && closingChar != '"') {
        closingArray.push(groups[char]);
        closingChar = groups[char];
      } else if (char == closingChar) {
        closingArray.pop();
        closingChar = closingArray[closingArray.length - 1];
      } else if (char == " " && !closingChar) {
        if (arg) {
          if (arg.startsWith('"') && arg.endsWith('"')) arg = arg.slice(1, -1);
          commandArgs.push(arg);
          arg = "";
        }
        stringIndex++;
        continue;
      }
      arg += char;
      stringIndex++;
    }
    if (arg) commandArgs.push(arg);
    return commandArgs;
  }

  /**
   * Check if the argument's value is convertable to
   * argument's value type and set the value on corresponding
   * argument inside object
   *
   * @param {String[]} message
   * List of arguments (in string)
   *
   * @return {object} Object of command arguments
   */
  #checkArguments(message) {
    // Run for checking the command's ID
    const rawCommand = this.#parseArguments(message, 1)[0];

    // Check if the command exist
    let commandArgs = this.commands.find(
      (command) => command.name === rawCommand
    )?.args;
    if (!commandArgs) return Print(`Commands ${rawCommand} is not available`);

    // Run the function for actual argument values
    const rawArgs = this.#parseArguments(message, commandArgs.length);
    let newArgs = {
      command: rawArgs[0],
    };

    // Index of argument value
    let argIndex = 1;
    for (let i = 0; i < commandArgs.length; i++) {
      if (!rawArgs[argIndex]) {
        newArgs[commandArgs[i]["name"]] =
          commandArgs[i]["default"] ??
          this.#errorArgs(`Argument ${commandArgs[i]["name"]} is required`);
        continue;
      }

      switch (commandArgs[i]["type"]) {
        case "option":
          const option = commandArgs[i]["list"].find(
            (options) => options.name === rawArgs[argIndex]
          );
          if (!option)
            this.#errorArgs(
              `There's no '${rawArgs[argIndex]}' option available`
            );

          newArgs[commandArgs[i]["name"]] = rawArgs[argIndex];
          commandArgs.splice(i + 1, 0, ...(option.subcommands ?? []));
          break;

        case "block":
          newArgs[commandArgs[i]["name"]] =
            MinecraftBlockTypes.get(
              !rawArgs[argIndex].includes(":")
                ? `minecraft:${rawArgs[argIndex]}`
                : rawArgs[argIndex]
            ) ?? this.#errorArgs(`${rawArgs[argIndex]} is not a valid block`);
          break;

        case "item":
          newArgs[commandArgs[i]["name"]] =
            ItemTypes.get(
              !rawArgs[argIndex].includes(":")
                ? "minecraft:" + rawArgs[argIndex]
                : rawArgs[argIndex]
            ) ?? this.#errorArgs(`${rawArgs[argIndex]} is not a valid item`);
          break;

        case "location":
          newArgs[commandArgs[i]["name"]] = {
            x: !isNaN(rawArgs[argIndex])
              ? Number(rawArgs[argIndex])
              : this.#errorArgs(
                  `"${rawArgs[argIndex]}" is not a valid integer (loc:x).`
                ),
            y: !isNaN(rawArgs[argIndex + 1])
              ? Number(rawArgs[argIndex + 1])
              : this.#errorArgs(
                  `"${rawArgs[argIndex + 1]}" is not a valid integer (loc:y).`
                ),
            z: !isNaN(rawArgs[argIndex + 2])
              ? Number(rawArgs[argIndex + 2])
              : this.#errorArgs(
                  `"${rawArgs[argIndex + 2]}" is not a valid integer (loc:z).`
                ),
          };
          argIndex += 2;
          break;

        case "selector":
          newArgs[commandArgs[i]["name"]] = this.#argumentSelector(
            rawArgs[argIndex]
          );
          break;

        case "object":
          try {
            JSON.parse(rawArgs[argIndex]);
          } catch (err) {
            this.#errorArgs(`Cannot parse JSON Object\n(${err})`);
          }
          newArgs[commandArgs[i]["name"]] = JSON.parse(rawArgs[argIndex]);
          break;

        case "number":
          if (isNaN(rawArgs[argIndex]))
            this.#errorArgs(`"${rawArgs[argIndex]}" is not a valid integer.`);
          else if (
            Number(rawArgs[argIndex]) < commandArgs[i]["options"]["min"] ??
            -2_147_483_648
          )
            this.#errorArgs(
              `"${rawArgs[argIndex]}" is too small (minimum is ${
                commandArgs[i]["options"]["min"] ?? -2_147_483_648
              })`
            );
          else if (
            Number(rawArgs[argIndex]) > commandArgs[i]["options"]["max"] ??
            2_147_483_647
          )
            this.#errorArgs(
              `"${rawArgs[argIndex]}" is too large (maximum is ${
                commandArgs[i]["options"]["max"] ?? 2_147_483_647
              })`
            );
          else newArgs[commandArgs[i]["name"]] = Number(rawArgs[argIndex]);
          break;

        case "boolean":
          newArgs[commandArgs[i]["name"]] =
            rawArgs[argIndex] === "true" || rawArgs[argIndex] === "false"
              ? rawArgs[argIndex] === "true"
              : this.#errorArgs(
                  `"${rawArgs[argIndex]}" is not a valid boolean`
                );
          break;

        case "string":
          if (commandArgs[i]["default"])
            newArgs[commandArgs[i]["name"]] = commandArgs[i]["default"];
          else
            this.#errorArgs(`Argument ${commandArgs[i]["name"]} is required`);
          break;
      }
      argIndex++;
    }
    return newArgs;
  }

  #argumentSelector(message) {
    let list = message.match(
        /(\w+)\s*\=\s*((?:\!?\w+)|(?:\!?\".+?\")|(?:\{.+?\}))/g
      ),
      data = {},
      location = {},
      volume = {};
    for (let i = 0; i < list.length; i++) {
      let [key, ...value] = list[i].split("=");
      value = value.join("=");

      switch (key.trim()) {
        case "c":
          if (value.startsWith("-")) data.farthest = value;
          else data.closest = value;
          break;

        case "dx":
          volume.x = Number(value);
          break;

        case "dy":
          volume.y = Number(value);
          break;

        case "dz":
          volume.z = Number(value);
          break;

        case "family":
          if (value.startsWith("!"))
            !data.excludeFamilies
              ? (data.excludeFamilies = [
                  value.startsWith('"') ? value.slice(2, -1) : value.slice(1),
                ])
              : data.excludeFamilies.push(
                  value.startsWith('"') ? value.slice(2, -1) : value.slice(1)
                );
          else
            !data.families
              ? (data.families = [
                  value.startsWith('"') ? value.slice(1, -1) : value,
                ])
              : data.families.push(
                  value.startsWith('"') ? value.slice(1, -1) : value
                );
          break;

        case "l":
          data.maxLevel = Number(value);
          break;

        case "lm":
          data.minLevel = Number(value);
          break;

        case "m":
          data.gameMode = Number(value);
          break;

        case "name":
          if (value.startsWith("!"))
            !data.excludeNames
              ? (data.excludeNames = [
                  value.startsWith('"') ? value.slice(2, -1) : value.slice(1),
                  ,
                ])
              : data.excludeNames.push(
                  value.startsWith('"') ? value.slice(2, -1) : value.slice(1)
                );
          else if (data.name)
            throw new Error("Argument selector 'name' doubled");
          else data.name = value.startsWith('"') ? value.slice(1, -1) : value;
          break;

        case "r":
          data.maxDistance = Number(value);
          break;

        case "rm":
          data.minDistance = Number(value);
          break;

        case "rx":
          data.maxHorizontalRotation = Number(value);
          break;

        case "rxm":
          data.minHorizontalRotation = Number(value);
          break;

        case "ry":
          data.maxVerticalRotation = Number(value);
          break;

        case "rym":
          data.minVerticalRotation = Number(value);
          break;

        case "scores": // Need fix
          const scoreList = value.match(
            /(\w+)\s*\=\s*(?:\!?(\d+)?(\.\.)?(\d+)?)/g
          );
          if (scoreList.length === 0) break;

          let scoreData = [];
          for (const scoreArg of scoreList) {
            let scoreCurrent = {};
            let [scoreKey, scoreValue] = scoreArg.split("=");
            scoreCurrent.objective = scoreKey;
            if (scoreValue.startsWith("!")) {
              scoreCurrent.exclude = true;
              scoreValue = scoreValue.slice(1);
            }
            if (scoreValue.startsWith(".."))
              scoreCurrent.maxScore = scoreValue.replace("..", "");
            else if (scoreValue.endsWith(".."))
              scoreCurrent.minScore = scoreValue.replace("..", "");
            else {
              scoreCurrent.minScore = scoreValue.replace("..", "")[0];
              scoreCurrent.maxScore = scoreValue.replace("..", "")[1];
            }
            scoreData.push(scoreCurrent);
          }
          data.scoreOptions = scoreData;
          break;

        case "tag":
          if (value.startsWith("!"))
            !data.excludeTags
              ? (data.excludeTags = [
                  value.startsWith('"') ? value.slice(2, -1) : value.slice(1),
                  ,
                ])
              : data.excludeTags.push(
                  value.startsWith('"') ? value.slice(2, -1) : value.slice(1)
                );
          else
            !data.tags
              ? (data.tags = [
                  value.startsWith('"') ? value.slice(1, -1) : value,
                ])
              : data.tags.push(
                  value.startsWith('"') ? value.slice(1, -1) : value
                );
          break;

        case "type":
          if (value.startsWith("!"))
            !data.excludeTypes
              ? (data.excludeTypes = [
                  value.startsWith('"') ? value.slice(2, -1) : value.slice(1),
                ])
              : data.excludeTypes.push(
                  value.startsWith('"') ? value.slice(2, -1) : value.slice(1)
                );
          else if (data.type)
            throw new Error("Argument selector 'type' doubled");
          else data.type = value.startsWith('"') ? value.slice(1, -1) : value;
          break;

        case "x":
          location.x = Number(value);
          break;

        case "y":
          location.y = Number(value);
          break;

        case "z":
          location.z = Number(value);
          break;
      }
    }
    if (Object.keys(location).length !== 0) data.location = location;
    if (Object.keys(volume).length !== 0) data.volume = volume;

    console.log(message, JSON.stringify(list), JSON.stringify(data));
    return data;
  }

  #commandHandler(player, command) {
    const argument = this.#checkArguments(command);
    // console.log(argument);
    if (!argument) return;

    this.commands
      .find((command) => command["name"] == argument.command)
      .callback(player, argument);
  }

  /**
   * Throw command error
   *
   * @param {String} message
   * The error message
   *
   * @throws Throw a message error
   */
  #errorArgs(message) {
    Print(`§c${message}§r`);
    throw new Error(message);
  }

  #helpHandler(player, message) {
    const argument = this.#parseArguments(message);
    if (!argument) return;

    const command = this.commands.find(
      (command) => command.name === argument[0]
    );
    if (!command) this.#errorArgs(`There's no command '${argument[0]}'`);

    let helpMessage = `\\${command.name} ~ ${command.desc}\nArguments: ${command.name} `;
    for (let i = 0; i < command.args.length; i++) {
      helpMessage += `[${command.args[i].name}${
        command.args[i].default != undefined ? "?" : ""
      }: ${command.args[i].type}] `;
    }

    console.log(helpMessage);
  }

  /**
   * Activate beforeChat event
   */
  #run() {
    world.events.beforeChat.subscribe((eventChat) => {
      const { message, sender: player } = eventChat;

      if (message.startsWith(this.prefix)) {
        // Cancel the message being sent
        eventChat.cancel = true;
        // Run the command
        this.#commandHandler(player, message.replace(this.prefix, ""));
      } else if (message.startsWith(this.helpPrefix)) {
        // Cancel the message being sent
        eventChat.cancel = true;
        // Run the command
        this.#helpHandler(player, message.replace(this.helpPrefix, ""));
      }
    });

    system.events.scriptEventReceive.subscribe((eventScript) => {
      // Run when "debug:command" message ID was specify
      if (eventScript.id === "debug:command") {
        // Logs the info that the command ran with "/scriptevent" command
        console.log(
          `Custom command executed with '/scriptevent' command as ${eventScript.sourceType}\n${eventScript.message}`
        );
        if (eventScript.message.startsWith(this.helpPrefix)) {
          // console.log("2");
          // Run the command
          this.#helpHandler(
            eventScript.sourceEntity,
            eventScript.message.replace(this.helpPrefix, "")
          );
        } else {
          // console.log("1");
          // Run the command
          this.#commandHandler(
            eventScript.sourceEntity,
            eventScript.message.replace(this.prefix, "")
          );
        }
      }
    });
  }
}

export default new CustomCommand();
