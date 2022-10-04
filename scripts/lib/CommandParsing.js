/**
 * Parsing command into an array of command arguments
 * (Inspired by @FrostIce482)
 *
 * @param {String} command
 * The command arguments
 *
 * @param {Number} final
 * Return whole last command as string based of position of argument.
 * Default is `0` (No final argument).
 *
 * @return {String[]} List of command arguments
 */
export default function parseCommand(command, final = 0) {
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
    if (commandArgs.length === final && final > 0) {
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
  return commandArgs;
}
