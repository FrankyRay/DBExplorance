import { world, system } from "@minecraft/server";
import parseCommand from "./ParseCommand";
import { commandList } from "./Command";

// Custom command prefix.
const prefix = "\\";
// Custom help command prefix.
const helpPrefix = "?";

world.events.beforeChat.subscribe((eventChat) => {
  const { message, sender: player } = eventChat;
  if (message.startsWith(Options.prefix)) {
    // Cancel the message being sent
    eventChat.cancel = true;
    // Run the command
    runCommand(player, message);
  }
});

system.events.scriptEventReceive.subscribe((eventScript) => {
  // Run when "debug:command" message ID was specify
  if (eventScript.id === "debug:command") {
    // Logs the info that the command ran with "/scriptevent" command
    console.log(
      `Custom command executed with '/scriptevent' command as ${
        eventScript.scriptEntity?.id ?? eventScript.sourceType
      }\n${eventScript.message}`
    );
    // Run the command
    runCommand(
      eventScript.scriptEntity ?? eventScript.sourceType,
      eventScript.message
    );
  }
});

function runCommand(player, command) {
  let data;
  if (command.startsWith(prefix))
    data = parseCommand(player, command.substring(prefix.length));

  console.log(JSON.stringify(data));
  commandList[data.command].callback(player, data);
}
