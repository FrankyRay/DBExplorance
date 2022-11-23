import CustomCommand from "./command";
import Print from "../lib/Print";

const commands = new CustomCommand();

commands.addCommand(
  "ping",
  "Send pong! (Used to test if the script runs properly)",
  [],
  (player, ctx) => {
    Print("Pong!");
    console.log("Pong!");
  }
);
