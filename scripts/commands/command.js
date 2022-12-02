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
        commandArgs.push(command.slice(stringIndex + 2).trim());
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
        continue;
      }
      arg += char;
      stringIndex++;
      // console.log(stringIndex);
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
    // console.log(rawCommand);

    // Check if the command exist
    const commandArgs = this.commands.find(
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
      switch (commandArgs[i]["type"]) {
        case "block":
          if (!rawArgs[argIndex])
            newArgs[commandArgs[i]["name"]] =
              MinecraftBlockTypes.get(commandArgs[i]["default"]) ??
              this.#errorArgs(`Argument ${commandArgs[i]["name"]} is required`);
          else {
            newArgs[commandArgs[i]["name"]] =
              MinecraftBlockTypes.get(
                !rawArgs[argIndex].includes(":")
                  ? `minecraft:${rawArgs[argIndex]}`
                  : rawArgs[argIndex]
              ) ?? this.#errorArgs(`${rawArgs[argIndex]} is not a valid block`);
          }
          break;

        case "item":
          if (!rawArgs[argIndex])
            newArgs[commandArgs[i]["name"]] =
              ItemTypes.get(commandArgs[i]["default"]) ??
              this.#errorArgs(`Argument ${commandArgs[i]["name"]} is required`);
          else {
            newArgs[commandArgs[i]["name"]] =
              ItemTypes.get(
                !rawArgs[argIndex].includes(":")
                  ? `minecraft:${rawArgs[argIndex]}`
                  : rawArgs[argIndex]
              ) ?? this.#errorArgs(`${rawArgs[argIndex]} is not a valid item`);
          }
          break;

        case "location":
          if (!rawArgs[argIndex])
            newArgs[commandArgs[i]["name"]] =
              commandArgs[i]["default"] ??
              this.#errorArgs(`Argument ${commandArgs[i]["name"]} is required`);
          else {
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
          }
          break;

        case "object":
          if (!rawArgs[argIndex])
            newArgs[commandArgs[i]["name"]] =
              commandArgs[i]["default"] ??
              this.#errorArgs(`Argument ${commandArgs[i]["name"]} is required`);
          else {
            try {
              JSON.parse(rawArgs[argIndex]);
            } catch (err) {
              this.#errorArgs(`Cannot parse JSON Object\n(${err})`);
            }
            newArgs[commandArgs[i]["name"]] = JSON.parse(rawArgs[argIndex]);
          }
          break;

        case "number":
          if (!rawArgs[argIndex])
            newArgs[commandArgs[i]["name"]] =
              commandArgs[i]["default"] ??
              this.#errorArgs(`Argument ${commandArgs[i]["name"]} is required`);
          else if (isNaN(rawArgs[argIndex]))
            this.#errorArgs(`"${rawArgs[argIndex]}" is not a valid integer.`);
          else if (
            Number(rawArgs[argIndex]) < commandArgs[i]["options"]["min"] ??
            -2_147_483_648
          )
            this.#errorArgs(
              `"${rawArgs[argIndex]}" is too small (minimum is ${commandArgs[i]["options"]["min"]})`
            );
          else if (
            Number(rawArgs[argIndex]) > commandArgs[i]["options"]["max"] ??
            -2_147_483_648
          )
            this.#errorArgs(
              `"${rawArgs[argIndex]}" is too large (maximum is ${commandArgs[i]["options"]["max"]})`
            );
          else newArgs[commandArgs[i]["name"]] = Number(rawArgs[argIndex]);
          break;

        case "boolean":
          if (!rawArgs[argIndex])
            newArgs[commandArgs[i]["name"]] = commandArgs[i]["default"];
          else
            newArgs[commandArgs[i]["name"]] =
              rawArgs[argIndex] === "true" || rawArgs[argIndex] === "false"
                ? rawArgs[argIndex] === "true"
                : this.#errorArgs(
                    `"${rawArgs[argIndex]}" is not a valid boolean`
                  );
          break;

        case "string":
          if (rawArgs[argIndex])
            newArgs[commandArgs[i]["name"]] = rawArgs[argIndex];
          else if (commandArgs[i]["default"])
            newArgs[commandArgs[i]["name"]] = commandArgs[i]["default"];
          else
            this.#errorArgs(`Argument ${commandArgs[i]["name"]} is required`);
          break;
      }
      argIndex++;
    }
    return newArgs;
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
          `Custom command executed with '/scriptevent' command as ${eventScript.sourceType}`
        );
        if (eventScript.message.startsWith(this.prefix)) {
          // Run the command
          this.#commandHandler(
            eventScript.sourceEntity,
            eventScript.message.replace(this.prefix, "")
          );
        } else if (eventScript.message.startsWith(this.helpPrefix)) {
          // Run the command
          this.#helpHandler(
            eventScript.sourceEntity,
            eventScript.message.replace(this.helpPrefix, "")
          );
        }
      }
    });
  }
}

export default new CustomCommand();
