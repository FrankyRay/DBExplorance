import Options from "./Options";

/**
 * Add custom command
 *
 * @param {string} name
 * Command name and ID
 *
 * @param {string} description
 * Command description
 *
 * @param {array} args
 * Command arguments
 *
 * @param {function} callback
 * Command function
 *
 * @param {boolean} operator
 * Run the command if player is OP
 */
export default function CustomCommand(
  name,
  description,
  args,
  callback,
  operator = false
) {
  commandList[name] = {
    name: name,
    description: description,
    operator: operator,
    arguments: args,
    callback: callback,
  };
}

export const commandList = {
  test: {
    name: "test",
    description: "Use for debug only",
    operator: true,
    arguments: [
      {
        name: "str",
        description: "String argument",
        type: "string",
      },
      {
        name: "int",
        description: "Integer argument",
        type: "number",
        options: {
          floatType: false,
          range: {
            min: 0,
          },
        },
        default: -1,
      },
    ],
    callback: (player, data) => console.log(player.name ?? player, data),
  },
};
