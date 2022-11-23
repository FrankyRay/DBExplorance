import { system } from "@minecraft/server";

system.events.beforeWatchdogTerminate.subscribe((data) => {
  data.cancel = true;

  console.error(data.terminateReason);
});
