import { world, system } from "@minecraft/server";

world.events.beforeChat.subscribe((eventChat) => {
  const { message, sender: player } = eventChat;
  // Cancel the message being sent
  eventChat.cancel = true;
  // Run the command
  // this.#executeCommand(player, message);
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
    // this.#executeCommand(eventScript.sourceType, eventScript.message);
  }
});
