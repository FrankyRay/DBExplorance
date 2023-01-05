import {
  world,
  system,
  MinecraftBlockTypes,
  ItemTypes,
  BlockLocation,
  Location,
  Vector,
  //* Used for docs and auto-completion
  Player,
  MessageSourceType,
  BlockType,
  ItemType,
  Vector3,
  XYRotation,
} from "@minecraft/server";

class CustomCommand {
  // Custom command prefix.
  prefix = "\\";
  // Custom help command prefix.
  helpPrefix = "?";

  // Default command options.
  #commandOptions = {
    string: {
      // Allow escape character functional.
      // TODO: Not implemented.
      escapeChar: false,
      // String length.
      length: {
        min: 0,
        max: Infinity, // Basically infinity.
      },
    },

    number: {
      // Allow float/decimal value.
      floatType: true,
      // Value range.
      range: {
        min: -2147483648,
        max: 2147483647,
      },
      // Return string instead of number.
      stringify: false,
    },

    boolean: {
      // Return string instead of boolean.
      stringify: false,
    },

    object: {
      // Return string instead of object.
      stringify: false,
    },

    block: {
      // Accept vanilla block only.
      vanillaOnly: false,
      // Allow creative block to non-op player
      creativeMode: true,
      // Return block's ID instead of BlockType class.
      stringify: false,
    },

    item: {
      // Accept vanilla item only.
      vanillaOnly: false,
      // Allow creative item to non-op player
      creativeMode: true,
      // Return item's ID instead of ItemType class.
      stringify: false,
    },

    location: {
      // Allow relative coordinate (~0).
      relativeValue: true,
      // Allow local coordinate (^0).
      // TODO: Not implemented.
      localValue: false,
      // Enable/disable coordinate axis.
      coordinateAxis: {
        x: true,
        y: true,
        z: true,
      },
      // Use zero as unspesified value.
      // Otherwise, use player's current location.
      zeroDefaultValue: false,
      // Type of data returned.
      // "Vector3", "Vector", "Location", "BlockLocation".
      outputData: "Vector3",
      // Return string instead of "outputData" type.
      stringify: false,
    },

    rotation: {
      // Allow relative rotation (~).
      relativeValue: false,
      // Return string instead of ItemType class.
      stringify: false,
    },

    selector: {},
  };

  // Command list
  #commandList = {
    ping: {
      name: "ping",
      description: "Say pong! (To check if the custom command is working)",
      operator: true,
      arguments: [],
      callback: (player, data) => {
        if (player instanceof Player) player.tell("Pong!");
        else world.say("Pong!");
        console.log("Pong! Custom command works properly");
      },
    },
  };

  // Argument type validation list
  #argumentType = {
    string: (v, a, p) => this.#stringArgumentType(v, a, p),
    number: (v, a, p) => this.#numberArgumentType(v, a, p),
    boolean: (v, a, p) => this.#booleanArgumentType(v, a, p),
    object: (v, a, p) => this.#objectArgumentType(v, a, p),
    block: (v, a, p) => this.#blockArgumentType(v, a, p),
    item: (v, a, p) => this.#itemArgumentType(v, a, p),
    location: (v, a, p) => this.#locationArgumentType(v, a, p),
    rotation: (v, a, p) => this.#rotationArgumentType(v, a, p),
  };

  constructor() {
    this.#chatEvent();
    this.#debugEvent();
  }

  //* Add command.
  /**
   * Adding custom command
   *
   * @param {object} data
   * Command data
   */
  addCommand(data) {
    this.#commandList[data.name] = data;
    console.log(
      `Successfully adding command "${data.name}" - "${data.description}"`
    );
  }

  //* Parsing command.
  /**
   * Parsing command into an array of command arguments
   * (Inspired by `FrostIce482#8139`)
   *
   * @param {Player} player
   * Player's class
   *
   * @param {String} command
   * Raw command arguments
   *
   * @return {object} Object of command arguments
   */
  #parseCommand(player, command) {
    const groups = {
      "{": "}",
      "[": "]",
      '"': '"',
    };

    let commandData = {},
      commandArgs = {},
      argLocRot = {},
      argValue = "",
      argIndex = 0,
      closingArray = [],
      closingChar = "";

    //? Start parsing
    for (const char of command) {
      if (char in groups && closingChar != '"') {
        closingArray.push(groups[char]);
        closingChar = groups[char];
      } else if (char == closingChar) {
        closingArray.pop();
        closingChar = closingArray[closingArray.length - 1];
      } else if (char == " " && !closingChar) {
        if (!argValue) continue;
        if (Object.keys(commandData).length === 0) {
          commandData =
            this.#commandList[argValue] ??
            this.#commandException(
              player,
              `Command ${argValue} is not found`,
              "commands.generic.unknown",
              [argValue]
            );

          if (
            commandData.operator &&
            player instanceof Player &&
            !player?.isOp()
          )
            this.#commandException(
              player,
              `Player ${player.name} cannot use ${argValue} because not operator`,
              "commands.generic.unknown",
              [argValue]
            );

          commandArgs.command = argValue;
          commandArgs.args = {};
        } else if (argIndex >= commandData.arguments.length) {
          this.#commandException(player, "Too many argument provided");
        } else if (commandData.arguments[argIndex].type === "location") {
          const [isDone, data] = this.#locationCheck(
            argLocRot,
            argValue,
            commandData.arguments[argIndex]
          );

          argLocRot = data;
          argValue = "";
          if (!isDone) continue;
          argLocRot = {};

          commandArgs.args[commandData.arguments[argIndex].name] =
            this.#argumentType[commandData.arguments[argIndex].type](
              data,
              commandData.arguments[argIndex],
              player
            );
          argIndex++;
        } else if (commandData.arguments[argIndex].type === "rotation") {
          const [isDone, data] = this.#rotationCheck(
            argLocRot,
            argValue,
            commandData.arguments[argIndex]
          );

          argLocRot = data;
          argValue = "";
          if (!isDone) continue;
          argLocRot = {};

          commandArgs.args[commandData.arguments[argIndex].name] =
            this.#argumentType[commandData.arguments[argIndex].type](
              data,
              commandData.arguments[argIndex],
              player
            );
          argIndex++;
        } else {
          commandArgs.args[commandData.arguments[argIndex].name] =
            this.#argumentType[commandData.arguments[argIndex].type](
              argValue,
              commandData.arguments[argIndex],
              player
            );
          argIndex++;
        }

        argValue = "";
        continue;
      }

      argValue += char;
    }

    //? Checks the value of the last argument entered
    if (argValue) {
      if (Object.keys(commandData).length === 0) {
        commandData =
          this.#commandList[argValue] ??
          this.#commandException(
            player,
            `Command ${argValue} is not found`,
            "commands.generic.unknown",
            [argValue]
          );

        if (commandData.operator && player instanceof Player && !player?.isOp())
          this.#commandException(
            player,
            `Player ${player.name} cannot use ${argValue} because not operator`,
            "commands.generic.unknown",
            [argValue]
          );

        commandArgs.command = argValue;
        commandArgs.args = {};
      } else if (argIndex >= commandData.arguments.length) {
        this.#commandException(player, "Too many argument provided");
      } else if (commandData.arguments[argIndex].type === "location") {
        const [isDone, data] = this.#locationCheck(
          argLocRot,
          argValue,
          commandData.arguments[argIndex]
        );

        if (!isDone)
          this.#commandException(player, "Location still not completed");

        commandArgs.args[commandData.arguments[argIndex].name] =
          this.#argumentType[commandData.arguments[argIndex].type](
            data,
            commandData.arguments[argIndex],
            player
          );
        argIndex++;
      } else if (commandData.arguments[argIndex].type === "rotation") {
        const [isDone, data] = this.#rotationCheck(
          argLocRot,
          argValue,
          commandData.arguments[argIndex]
        );

        argLocRot = data;
        if (!isDone)
          this.#commandException(player, "Rotation still not completed");

        commandArgs.args[commandData.arguments[argIndex].name] =
          this.#argumentType[commandData.arguments[argIndex].type](
            data,
            commandData.arguments[argIndex],
            player
          );
        argIndex++;
      } else {
        commandArgs.args[commandData.arguments[argIndex].name] =
          this.#argumentType[commandData.arguments[argIndex].type](
            argValue,
            commandData.arguments[argIndex],
            player
          );
        argIndex++;
      }
    }

    //? Insert the default value for the unspecified argument
    for (let i = argIndex; i < commandData.arguments.length; i++) {
      if (!commandData.arguments[i].default)
        this.#commandException(
          player,
          `Missing argument ${commandData.arguments[i].name}`
        );

      commandArgs.args[commandData.arguments[argIndex].name] =
        commandData.arguments[i].default;
    }
    return commandArgs;
  }

  /**
   * Constructs the value of the location type argument
   * @param {object} data
   * @param {string} value
   * @param {object} argument
   */
  #locationCheck(data, value, argument) {
    const axisX =
      argument.options?.coordinateAxis?.x ??
      this.#commandOptions.location.coordinateAxis.x;
    const axisY =
      argument.options?.coordinateAxis?.y ??
      this.#commandOptions.location.coordinateAxis.y;
    const axisZ =
      argument.options?.coordinateAxis?.z ??
      this.#commandOptions.location.coordinateAxis.z;
    const newData = { ...data };

    if (!data.x && axisX) {
      newData.x = value;
      if (!axisY && !axisZ) return [true, newData];
    } else if (!data.y && axisY) {
      newData.y = value;
      if (!axisZ) return [true, newData];
    } else if (!data.z && axisZ) {
      newData.z = value;
      return [true, newData];
    }

    return [false, newData];
  }

  /**
   * Constructs the value of the rotation type argument
   * @param {object} data
   * @param {string} value
   * @param {object} argument
   */
  #rotationCheck(data, value, argument) {
    const newData = { ...data };

    if (!data.x) {
      newData.x = value;
    } else if (!data.y) {
      newData.y = value;
      return [true, newData];
    }

    return [false, newData];
  }

  //* Argument type validation.
  /**
   * String argument type checker
   *
   * @param {string} value
   * Argument value
   *
   * @param {object} argument
   * Argument data
   *
   * @param {Player|MessageSourceType} player
   * Player class or MessageSourceType enum
   *
   * @return {string}
   */
  #stringArgumentType(value, argument, player) {
    const minLength =
      argument.options?.length?.min ?? this.#commandOptions.string.length.min;
    const maxLength =
      argument.options?.length?.max ?? this.#commandOptions.string.length.max;

    // Delete quotes from value.
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, 1);
    }

    //! ERROR: String length is too short.
    if (value.length < minLength) {
      this.#commandException(
        player,
        `Argument ${argument.name} is too short (${value.length} chars < ${minLength} chars)`
      );
    }

    //! ERROR: String length is too long.
    if (value.length > maxLength) {
      this.#commandException(
        player,
        `Argument ${argument.name} is too long (${value.length} chars > ${maxLength} chars)`
      );
    }

    return value;
  }

  /**
   * Number argument type checker
   *
   * @param {string} value
   * Argument value
   *
   * @param {object} argument
   * Argument data
   *
   * @param {Player|} player
   * Player class or MessageSourceType enum
   *
   * @return {number|string} Number (string if stringify == true)
   */
  #numberArgumentType(value, argument, player) {
    const isFloat =
      argument.options?.floatType ?? this.#commandOptions.number.floatType;
    const minValue =
      argument.options?.range?.min ?? this.#commandOptions.number.range.min;
    const maxValue =
      argument.options?.range?.max ?? this.#commandOptions.number.range.max;
    const stringify =
      argument.options?.stringify ?? this.#commandOptions.number.stringify;
    const number = Number(value);

    //! ERROR: Invalid number value.
    if (isNaN(number)) {
      this.#commandException(
        player,
        `Argument ${argument.name} has invalid number (${value})`,
        "commands.generic.num.invalid",
        [value]
      );
    }

    //! ERROR: Value type is float instead of integer.
    if (isFloat && number !== Math.round(number)) {
      this.#commandException(
        player,
        `Argument ${argument.name} type is float instead of integer`
      );
    }

    //! ERROR: Value is too small.
    if (number < minValue) {
      this.#commandException(
        player,
        `Argument ${argument.name} value is too small (${number} < ${minValue})`,
        "commands.generic.num.tooSmall",
        [number, minValue]
      );
    }

    //! ERROR: Value is too big.
    if (number > maxValue) {
      this.#commandException(
        player,
        `Argument ${argument.name} value is too big (${number} > ${maxValue})`,
        "commands.generic.num.tooBig",
        [number, maxValue]
      );
    }

    return stringify ? "" + number : number;
  }

  /**
   * Boolean argument type checker
   *
   * @param {string} value
   * Argument value
   *
   * @param {object} argument
   * Argument data
   *
   * @param {Player|MessageSourceType} player
   * Player class or MessageSourceType enum
   *
   * @return {boolean|string} Boolean (string if stringify == true)
   */
  #booleanArgumentType(value, argument, player) {
    const stringify =
      argument.options?.stringify ?? this.#commandOptions.boolean.stringify;

    //! ERROR: Invalid boolean type.
    if (value !== "true" || value !== "false") {
      this.#commandException(
        player,
        `Argument ${argument.name} has invalid boolean type '${value}'`
      );
    }

    return stringify ? value : value === "true";
  }

  /**
   * Object argument type checker
   *
   * @param {string} value
   * Argument value
   *
   * @param {object} argument
   * Argument data
   *
   * @param {Player|MessageSourceType} player
   * Player class or MessageSourceType enum
   *
   * @return {object|string} Object (string if stringify == true)
   */
  #objectArgumentType(value, argument, player) {
    const stringify =
      argument.options?.stringify ?? this.#commandOptions.object.stringify;
    let object;

    try {
      object = JSON.parse(value);
    } catch (error) {
      this.#commandException(
        player,
        `Failed to parse the object at argument ${argument.name}`
      );
    }

    return stringify ? JSON.stringify(object) : object;
  }

  /**
   * Block argument type checker
   *
   * @param {string} value
   * Argument value
   *
   * @param {object} argument
   * Argument data
   *
   * @param {Player|MessageSourceType} player
   * Player class or MessageSourceType enum
   *
   * @return {BlockType|string} BlockType (block id if stringify == true)
   */
  #blockArgumentType(value, argument, player) {
    const vanillaOnly =
      argument.options?.vanillaOnly ?? this.#commandOptions.block.vanillaOnly;
    const creativeMode =
      argument.options?.creativeMode ?? this.#commandOptions.block.creativeMode;
    const stringify =
      argument.options?.stringify ?? this.#commandOptions.block.stringify;
    const block = MinecraftBlockTypes.get(value);

    //! ERROR: Block is not found.
    if (!block) {
      this.#commandException(player, `Block '${value}' is not found`);
    }

    //! ERROR: Block must be vanilla.
    if (
      value.includes(":") &&
      value.substring(0, value.indexOf(":")) !== "minecraft"
    ) {
      this.#commandException(player, `Block must be vanilla`);
    }

    //! ERROR: Creative block to non-op player.
    // TODO: Not implemented.
    if (
      creativeBlock.includes(value.replace("minecraft:", "")) &&
      !player.isOp()
    ) {
      this.#commandException(
        player,
        `You have no permission to use block '${value}'`
      );
    }

    return stringify ? block.id : block;
  }

  /**
   * Item argument type checker
   *
   * @param {string} value
   * Argument value
   *
   * @param {object} argument
   * Argument data
   *
   * @param {Player|MessageSourceType} player
   * Player class or MessageSourceType enum
   *
   * @return {ItemType|string} ItemType (item id if stringify == true)
   */
  #itemArgumentType(value, argument, player) {
    const vanillaOnly =
      argument.options?.vanillaOnly ?? this.#commandOptions.item.vanillaOnly;
    const creativeMode =
      argument.options?.creativeMode ?? this.#commandOptions.item.creativeMode;
    const stringify =
      argument.options?.stringify ?? this.#commandOptions.item.stringify;
    const item = ItemTypes.get(value);

    //! ERROR: Item is not found.
    if (!item) {
      this.#commandException(player, `Item '${value}' is not found`);
    }

    //! ERROR: Item must be vanilla.
    if (
      value.includes(":") &&
      value.substring(0, value.indexOf(":")) !== "minecraft"
    ) {
      this.#commandException(player, `Item must be vanilla`);
    }

    //! ERROR: Creative item to non-op player.
    // TODO: Not implemented.
    if (
      creativeItem.includes(value.replace("minecraft:", "")) &&
      !player.isOp()
    ) {
      this.#commandException(
        player,
        `You have no permission to use item '${value}'`
      );
    }

    return stringify ? item.id : item;
  }

  /**
   * Location argument type checker
   *
   * @param {object} value
   * Argument value
   *
   * @param {object} argument
   * Argument data
   *
   * @param {Player|MessageSourceType} player
   * Player class or MessageSourceType enum
   *
   * @return {BlockLocation|Location|Vector|Vector3|string} One of those 3 location class or object (string if stringify == true)
   */
  #locationArgumentType(value, argument, player) {
    const relativeValue =
      argument.options?.relativeValue ??
      this.#commandOptions.location.relativeValue;
    const localValue =
      argument.options?.localValue ?? this.#commandOptions.location.localValue;
    const zeroDefaultValue =
      argument.options?.zeroDefaultValue ??
      this.#commandOptions.location.zeroDefaultValue;
    const outputData =
      argument.options?.outputData ?? this.#commandOptions.location.outputData;
    const stringify =
      argument.options?.stringify ?? this.#commandOptions.location.stringify;

    let rawLocation;
    if (zeroDefaultValue) rawLocation = { x: 0, y: 0, z: 0 };
    else
      rawLocation =
        player.location ??
        this.#commandException(
          player,
          "Cannot get player's/entity's location. Use 'zeroDefaultValue' options or run the command from player",
          "commands.generic.exception",
          []
        );

    for (const axis of Object.keys(rawLocation)) {
      if (!value[axis]) continue;

      if (value[axis].startsWith("~")) {
        if (!relativeValue)
          this.#commandException(
            player,
            `Argument ${argument.name} cannot use relative coordinate`
          );
        rawLocation[axis] =
          player.location[axis] +
          Number(value.substring(1) !== "" ? value.substring(1) : 1);
      } else if (value[axis].startsWith("^")) {
        this.#commandException(
          player,
          "Any location argument type cannot use local coordinate for now"
        );
      } else {
        rawLocation[axis] = Number(value[axis]);
      }
    }

    let newLocation;
    switch (outputData) {
      case "Location":
        newLocation = new Location(...Object.values(rawLocation));
        break;
      case "BlockLocation":
        newLocation = new BlockLocation(...Object.values(rawLocation));
        break;
      case "Vector":
        newLocation = new Vector(...Object.values(rawLocation));
        break;
      default:
        newLocation = rawLocation;
    }

    return stringify ? Object.values(rawLocation).join(" ") : newLocation;
  }

  /**
   * Rotation argument type checker
   *
   * @param {object} value
   * Argument value
   *
   * @param {object} argument
   * Argument data
   *
   * @param {Player|MessageSourceType} player
   * Player class or MessageSourceType enum
   *
   * @return {object|string} Object (string if stringify == true)
   */
  #rotationArgumentType(value, argument, player) {
    const relativeValue =
      argument.options?.relativeValue ??
      this.#commandOptions.rotation.relativeValue;
    const stringify =
      argument.options?.stringify ?? this.#commandOptions.rotation.stringify;
    let newRotation = { x: 0, y: 0 };

    for (const axis of Object.keys(newRotation)) {
      if (!value[axis]) continue;

      //! ERROR: Rotation out of range
      if (
        (axis === "x" && (value[axis] < -180 || value[axis] > 180)) ||
        (axis === "y" && (value[axis] < -90 || value[axis] > 90))
      ) {
        this.#commandException(
          player,
          `Rotation out of range (${axis.toUpperCase()} = ${value[axis]})`,
          "commands.generic.rotationError",
          []
        );
      }

      if (value[axis].startsWith("~")) {
        if (!relativeValue)
          this.#commandException(
            player,
            `Argument ${argument.name} cannot use relative coordinate`
          );
        newRotation[axis] =
          player.rotation[axis] +
          Number(value.substring(1) !== "" ? value.substring(1) : 1);
      } else {
        newRotation[axis] = Number(value[axis]);
      }
    }

    return stringify ? Object.values(newRotation).join(" ") : newRotation;
  }

  //* Error handling
  /**
   * Throw error message to player (private)/world (public)
   * and end the command
   *
   * @param {Player|MessageSourceType} player
   * Player class or MessageSourceType enum
   *
   * @param {string} message
   * Error message
   *
   * @param {string} langKey
   * Lang key for multi-language error message (on .lang)
   *
   * @param {string[]} langValue
   * Lang value use for error message
   *
   * @throws Error command
   */
  #commandException(player, message, langKey = "", langValue = []) {
    let rawtext;
    if (langKey) {
      rawtext = {
        rawtext: [
          {
            translate: langKey,
            with: {
              rawtext:
                langValue?.map((val) => {
                  return {
                    text: "" + val,
                  };
                }) ?? [],
            },
          },
        ],
      };
    }

    if (player instanceof Player && rawtext) {
      player.runCommandAsync(`tellraw @s ${JSON.stringify(rawtext)}`);
    } else if (typeof player === "string" && rawtext) {
      rawtext.rawtext.splice(0, 0, `[/scriptevent][${player}]: `);
      world
        .getDimension("overworld")
        .runCommandAsync(`tellraw @s ${JSON.stringify(rawtext)}`);
    }

    throw message;
  }

  //* Chat/Script Event.
  #chatEvent() {
    world.events.beforeChat.subscribe((eventChat) => {
      const { message, sender: player } = eventChat;
      if (message.startsWith(this.#commandOptions.prefix)) {
        // Cancel the message being sent
        eventChat.cancel = true;
        // Run the command
        this.#runCommand(player, message);
      }
    });
  }

  #debugEvent() {
    system.events.scriptEventReceive.subscribe((eventScript) => {
      // Run when "debug:command" message ID was specify
      if (eventScript.id === "debug:command") {
        // Logs the info that the command ran with "/scriptevent" command
        console.log(
          `Custom command executed with '/scriptevent' command as ${
            eventScript.initiator?.id ??
            eventScript.sourceEntity?.id ??
            eventScript.sourceType
          } => "${eventScript.message}"`
        );
        // Run the command
        this.#runCommand(
          eventScript.initiator ??
            eventScript.sourceEntity ??
            eventScript.sourceType,
          eventScript.message
        );
      }
    });
  }

  //* Running the command.
  #runCommand(player, command) {
    let data;
    if (command.startsWith(this.prefix))
      data = this.#parseCommand(player, command.substring(this.prefix.length));
    else return;

    try {
      this.#commandList[data.command].callback(player, data);
    } catch (error) {
      this.#commandException(
        player,
        `${error}\n${error.stack}`,
        "commands.generic.exception",
        []
      );
    }
  }
}

export default new CustomCommand();
