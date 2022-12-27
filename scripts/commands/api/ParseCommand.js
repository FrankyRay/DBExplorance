import { Player } from "@minecraft/server";
import CommandException from "./Exceptions";
import Options from "./Options";
// Argument Type Checker
import stringArgumentType from "./arguments/StringArgumentType";
import numberArgumentType from "./arguments/NumberArgumentType";
import boolArgumentType from "./arguments/BoolArgumentType";
import objectArgumentType from "./arguments/ObjectArgumentType";
// Argument Type Checker Expansion
import blockArgumentType from "./arguments/BlockArgumentType";
import itemArgumentType from "./arguments/ItemArgumentType";

const argumentType = {
  string: stringArgumentType,
  number: numberArgumentType,
  boolean: boolArgumentType,
  object: objectArgumentType,
  block: blockArgumentType,
  item: itemArgumentType,
};

let commandsList = {};

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
function parseCommand(player, command) {
  const groups = {
    "{": "}",
    "[": "]",
    '"': '"',
  };

  let commandData = [],
    commandArgs = {},
    argLocRot = {},
    argValue = "",
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
      if (!argValue) continue;
      if (Object.keys(commandData).length === 0) {
        commandData =
          commandsList[argValue] ??
          CommandException(player, `Command ${arg} is not found`);
        commandArgs.command = argValue;
        commandArgs.args = {};
      } else if (argIndex >= commandData.args.length) {
        CommandException(player, "Too many argument provided");
      } else if (commandData.args[argIndex].type === "location") {
        const [isDone, data] = locationCheck(
          argLocRot,
          argValue,
          commandData.args[argIndex]
        );

        argLocRot = data;
        if (!isDone) continue;

        commandArgs.args[commandData.args[argIndex].name] = argumentType[
          commandData.args[argIndex].type
        ](data, commandData.args[argIndex], player);
        argIndex++;
      } else {
        commandArgs.args[commandData.args[argIndex].name] = argumentType[
          commandData.args[argIndex].type
        ](argValue, commandData.args[argIndex], player);
        argIndex++;
      }

      arg = "";
      continue;
    }
  }
}

/**
 * @param {object} data
 * @param {string} value
 * @param {object} argument
 */
function locationCheck(data, value, argument) {
  const axisX =
    argument.options?.coordinateAxis?.x ?? Options.location.coordinateAxis.x;
  const axisY =
    argument.options?.coordinateAxis?.y ?? Options.location.coordinateAxis.y;
  const axisZ =
    argument.options?.coordinateAxis?.z ?? Options.location.coordinateAxis.z;
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
