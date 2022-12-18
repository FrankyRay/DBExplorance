import { world } from "@minecraft/server";
import CustomCommand from "./command";
import Print from "../lib/Print";

CustomCommand.addCommand(
  "ping",
  "Send pong! (Used to test if the script runs properly)",
  [],
  (player, ctx) => {
    player.tell("Pong!");
    console.log("Pong!", player.name ?? player);
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
        float: false,
        min: 0,
        max: 5,
      },
      default: 0,
    },
  ],
  (player, ctx) => {
    console.log("Test command", player.name ?? player, JSON.stringify(ctx));
  }
);
