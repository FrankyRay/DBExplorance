import { world } from "@minecraft/server";

world.events.beforeItemUseOn.subscribe((evd) => {
  console.warn(JSON.stringify(evd.getBlockLocation()));
});
