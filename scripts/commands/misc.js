import CustomCommand from "./command";
import Print from "../lib/Print";

CustomCommand.addCommand(
  "ping",
  "Send pong! (Used to test if the script runs properly)",
  [],
  (player, ctx) => {
    Print("Pong!");
    console.log("Pong!");
  }
);

CustomCommand.addCommand(
  "hello",
  "Send the response of greetings",
  [
    {
      name: "name",
      desc: "Name of the player (Default: player's name)",
      type: "string",
      default: "---",
    },
  ],
  (player, ctx) => {
    if (ctx.name === "---")
      return Print(`Hello ${player.name ?? "<Anonymous>"}!`);
    Print(`Hello ${ctx.name}!`);
  }
);

CustomCommand.addCommand(
  "test",
  "Test new features",
  [
    {
      name: "str",
      description: "The string",
      type: "string",
    },
    {
      name: "int",
      description: "The number",
      type: "number",
      options: {
        min: 0,
        max: 5,
      },
      default: 0,
    },
  ],
  (player, ctx) => {
    console.log("Test command", JSON.stringify(ctx));
  }
);
