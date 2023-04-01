import { world } from "@minecraft/server";
import EntityForm from "./Entity/Main";

const forms = {
  EntityInteraction: EntityForm,
};

world.events.itemUse.subscribe((eventData) => {
  const { item, source } = eventData;
  const [usage] = item.getLore();

  if (item.typeId !== "minecraft:book" || !usage.startsWith("§rUsage: "))
    return;
  forms[usage.slice(9)](source);
});
