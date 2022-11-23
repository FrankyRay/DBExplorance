import { world } from "@minecraft/server";

export default class CustomCommand {
  // Command prefix
  prefix = "\\";

  // Valid argument types
  argsType = ["string", "number", "boolean", "object", "location"];

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
        commandArgs.push(command.slice(stringIndex + 1).trim());
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
    }
    if (arg) commandArgs.push(arg);
    return this.#checkArguments(commandArgs);
  }

  /**
   * Check if the argument's value is convertable to
   * argument's value type and set the value on corresponding
   * argument inside object
   *
   * @param {String[]} rawArgs
   * List of arguments (in string)
   *
   * @return {object} Object of command arguments
   */
  #checkArguments(rawArgs) {
    let newArgs = {
      command: rawArgs[0],
    };
    const commandArgs = this.commands.find(
      (command) => command.name === rawArgs[0]
    )["args"];

    let argIndex = 1;
    for (let i = 0; i < commandArgs.length; i++) {
      switch (commandArgs[i]["type"]) {
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
          else
            newArgs[commandArgs[i]["name"]] = !isNaN(rawArgs[argIndex])
              ? Number(rawArgs[argIndex])
              : this.#errorArgs(
                  `"${rawArgs[argIndex]}" is not a valid integer.`
                );
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
    const argument = this.#parseArguments(command);

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
    throw new Error(message);
  }

  /**
   * Activate beforeChat event
   */
  #run() {
    world.events.beforeChat.subscribe((eventChat) => {
      const { cancel, message, sender: player } = eventChat;

      if (message.startsWith(this.prefix)) {
        // Cancel the message being sent
        cancel = true;
        // Run the command
        this.#commandHandler(player, message);
      }
    });
  }
}
