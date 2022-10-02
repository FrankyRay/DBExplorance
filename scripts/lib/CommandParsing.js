/**
 * Parsing command into an array of command arguments
 * (Inspired by @FrostIce482)
 *
 * @param {String} command
 * The command arguments
 *
 * @return {String[]} List of command arguments
 */
export default function parseCommand(command) {
  const groups = {
    "{": "}",
    "[": "]",
    '"': '"',
  };

  let commandArgs = [],
    arg = "",
    escChar = false,
    closingArray = [],
    closingChar = "";
  for (const char of command) {
    if (escChar) {
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
  }
  if (arg) commandArgs.push(arg);
  return commandArgs;
}
