import { Player, world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import GetScore from "../../lib/GetScore";

const events = [
  "blockBreak",
  "blockExplode",
  "blockPlace",
  "buttonPush",
  "chat",
  "dataDrivenEntityTriggerEvent",
  "effectAdd",
  "entityCreate",
  "entityHit",
  "entityHurt",
  "explosion",
  "itemCompleteCharge",
  "itemDefinitionEvent",
  "itemReleaseCharge",
  "itemStartCharge",
  "itemStartUseOn",
  "itemStopCharge",
  "itemStopUseOn",
  "itemUse",
  "itemUseOn",
  "leverActivate",
  "pistonActivate",
  "playerJoin",
  "playerLeave",
  "projectileHit",
  // "tick",
  "weatherChange",
  // "worldInitialize",
];

world.events.beforeItemUse.subscribe((eventItem) => {
  let item = eventItem.item;
  // console.warn(`Console Command Debug => BeforeItemUse Event -> ${item.id}`);
  /** @type {import("@minecraft/server").Player} */
  let player = eventItem.source;
  let lores = item.getLore();

  if (item.id == "minecraft:stick" && lores.includes("§rGametest Option")) {
    GameTestOptions(player);
  }
});

/**
 * @param {Player} player
 */
function GameTestOptions(player) {
  const formOpt = new ActionFormData()
    .title("Gametest Options")
    .body("Change some option")
    .button("Event Handler")
    .button("Setup Data");

  formOpt.show(player).then((response) => {
    if (response.isCanceled || response.canceled) return;

    switch (response.selection) {
      case 0:
        EventHandlerOptions(player);
        break;

      case 1:
        SetupOptions();
        break;
    }
  });
}

/**
 * @param {Player} player
 */
function EventHandlerOptions(player) {
  const eventHandlerForm = new ModalFormData().title("Event Handler Option");
  for (const event of events) {
    eventHandlerForm.toggle(
      `${event}\n§8[§cOFF§8/§aON§8]`,
      Boolean(GetScore(event, "gt_events"))
    );
  }

  eventHandlerForm.show(player).then((response) => {
    if (response.isCanceled || response.canceled) return;

    response.formValues.forEach((eventVal, eventIdx) => {
      player.runCommand(
        `scoreboard players set ${events[eventIdx]} gt_events ${
          eventVal ? 1 : 0
        }`
      );
    });
  });
}

function SetupOptions() {
  const OVERWORLD = world.getDimension("overworld");

  // Setup Event Handler
  OVERWORLD.runCommand(
    'scoreboard objectives add gt_events dummy "Event Handlers"'
  );
  events.forEach((eventVal) => {
    OVERWORLD.runCommand(`scoreboard players set ${eventVal} gt_events 0`);
  });
}
