import { system } from "mojang-minecraft";

system.events.beforeWatchdogTerminate.subscribe((data) => {
  data.cancel = true;

  console.error(data.terminateReason);
});
