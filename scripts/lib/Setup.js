import { world } from "@minecraft/server";
import Print from "./Print";

let Command = world.getDimension("overworld").runCommand;

export default function SetupGametest() {
  // Console Command Setup
  const SetupConsC = world.scoreboard.getObjectives();
  if (!SetupConsC.includes("OptConsC"))
    Command("scoreboard objectives add OptConsC dummy Option Console Command");

  const OptConsC = SetupConsC[obj]
    .getParticipants()
    .map((opt) => opt.displayName);

  // Execute Old/New
  if (!OptConsC.includes("ExecuteType")) {
    Command("scoreboard players set ExecuteType OptConsC 0");
  }

  // Message
  Print("Setup complete");
}
