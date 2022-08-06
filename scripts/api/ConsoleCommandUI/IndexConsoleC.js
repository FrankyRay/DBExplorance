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
  Camerashake: ConsC.Camerashake,
  Clear: ConsC.Clear,
  Clone: ConsC.Clone,
  Damage: ConsC.Damage,
  Dialogue: ConsC.Dialogue,
  Difficulty: ConsC.Difficulty,
  Effect: ConsC.Effect,
  Enchant: ConsC.Enchant,
  Event: ConsC.Event,
  Execute: null,
  Fill: ConsC.Fill,
  Fog: ConsC.Fog,
  Function: ConsC.Function,
  Gamemode: ConsC.Gamemode,
  Gamerule: ConsC.Gamerule,
  Gametest: null,
  Give: ConsC.Give,
  Help: null,
  Kick: ConsC.Kick,
  Kill: ConsC.Kill,
  Locate: ConsC.Locate,
  Loot: ConsC.Loot,
  Mobevent: ConsC.Mobevent,
  Music: ConsC.Music,
  Particle: ConsC.Particle,
  Playanimation: ConsC.Playanimation,
  Replaceitem: ConsC.Replaceitem,
  Ride: null,
  Schedule: ConsC.Schedules,
  Scoreboard: ConsC.Scoreboard,
  Setblock: ConsC.Setblock,
  Setworldspawn: ConsC.Setworldspawn,
  Sound: ConsC.Sound,
  Spawnpoint: ConsC.Spawnpoint,
  Spreadplayers: ConsC.Spreadplayers,
  Structure: ConsC.Structure,
  Summon: ConsC.Summon,
  Tag: ConsC.Tag,
  Teleport: ConsC.Teleport,
  Tell: ConsC.Tell,
  Testfor: ConsC.Testfor,
  Tickingarea: ConsC.Tickingarea,
  Time: ConsC.Time,
  Title: ConsC.Title,
  Volumearea: ConsC.Volumearea,
  Weather: ConsC.Weather,
  XP: ConsC.XP,
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
