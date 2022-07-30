// @ts-check
import { world, Player } from "mojang-minecraft";
import {
  ActionFormData,
  MessageFormData,
  ModalFormData,
} from "mojang-minecraft-ui";
import Print from "../../lib/Print";
import * as ConsC from "./FunctionsConsoleC.js";

let commandsFunction = {
  Ability: ConsC.Ability,
  Camerashake: null,
  Clear: null,
  Clone: null,
  Damage: null,
  Dialogue: null,
  Difficulty: null,
  Effect: null,
  Enchant: null,
  Event: null,
  Execute: null,
  Fill: null,
  Fog: null,
  Function: null,
  Gamemode: null,
  Gamerule: null,
  Gametest: null,
  Give: ConsC.Give,
  Help: null,
  Kick: null,
  Kill: null,
  Locate: null,
  Loot: null,
  Mobevent: null,
  Music: null,
  Particle: null,
  Playanimation: null,
  Replaceitem: null,
  Ride: null,
  Schedule: null,
  Scoreboard: null,
  Setblock: null,
  Setworldspawn: null,
  Sound: null,
  Spawnpoint: null,
  Spreadplayers: null,
  Structure: null,
  Summon: null,
  Tag: null,
  Teleport: null,
  Tell: null,
  Testfor: null,
  Tickingarea: null,
  Time: null,
  Title: null,
  Volumearea: null,
  Weather: null,
  XP: null,
};

let addonReq = ["Function", "Gametest", "Volumearea"];

/**
 * Open the main UI
 * @param {Player} player
 */
function ConsoleCommands(player) {
  let form = new ActionFormData()
    .title("Console Commands UI")
    .body("Run a command with UI Interface. Select one to run the command.");

  for (let command in commandsFunction) {
    form.button(`${command}\n§9[Press to run command]`);
  }

  form.show(player).then((response) => {
    if (response.isCanceled) return;

    let key = Object.keys(commandsFunction);
    if (commandsFunction[key[response.selection]] === null)
      return Print("The command was not available yet. Coming Soon!");

    commandsFunction[key[response.selection]](player);
  });
}

// Event `beforeItemUse` for open UI when player right-click stick with specific lore
world.events.beforeItemUse.subscribe((eventItem) => {
  let item = eventItem.item;
  // console.warn(`Console Command Debug => BeforeItemUse Event -> ${item.id}`);
  /** @type {import("mojang-minecraft").Player} */
  // @ts-ignore
  let player = eventItem.source;
  let lores = item.getLore();

  if (
    item.id == "minecraft:stick" &&
    lores.includes("§r§g[Console Commands UI]")
  ) {
    ConsoleCommands(player);
  }
});
