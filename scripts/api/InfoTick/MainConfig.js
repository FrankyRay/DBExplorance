import { world } from "mojang-minecraft";
import {
  ActionFormData,
  MessageFormData,
  ModalFormData,
} from "mojang-minecraft-ui";
import CancelReason from "../../lib/CancelationReason";
import Print from "../../lib/Print";

world.events.beforeItemUse.subscribe((eventItem) => {
  let item = eventItem.item;
  // console.warn(`Console Command Debug => BeforeItemUse Event -> ${item.id}`);
  /** @type {import("mojang-minecraft").Player} */
  // @ts-ignore
  let player = eventItem.source;
  let lores = item.getLore();

  if (item.id == "minecraft:arrow" && lores.includes("§r§g[Info Tick UI]")) {
    ConfigInfoTick(player);
  }
});

function ConfigInfoTick(player) {
  const configForm = new ActionFormData()
    .title("Information Tick Configurations")
    .body("Configurate the information to display")
    .button("Disable")
    .button("Player")
    .button("Block")
    .button("Item")
    .button("Entity");

  configForm.show(player).then((response) => {
    if (response.canceled)
      return console.warn(CancelReason(response.cancelationReason));

    switch (response.selection) {
      case 0:
        let tag = player.getTags().find((tag) => tag.startsWith("Debug:Tick"));
        if (tag) player.runCommand(`tag @s remove ${tag}`);
        Print("Remove the tick info!");
        break;

      case 1:
        PlayerInfoTick(player);
        break;

      case 2:
        BlockInfoTick(player);
        break;

      default:
        Print("Not available yet");
    }
  });
}

/**
 * @param {import("mojang-minecraft").Player} player
 */
function PlayerInfoTick(player) {
  const playerSelection = ["General", "List", "Health"];
  const playerConfigForm = new ModalFormData()
    .title("Player : Info-Tick Configuration")
    .toggle("Component Selection\n§8[§cDropdown§8/§aText Field§8]", false)
    .dropdown("Components List", playerSelection)
    .textField("Component Name §8[Capitalize]", "Component");

  playerConfigForm.show(player).then((response) => {
    if (response.canceled) {
      return Print(CancelReason(response.cancelationReason));
    }
    let [select, opt, text] = response.formValues;
    let component = select ? playerSelection[opt] : text;

    let tag = player.getTags().find((tag) => tag.startsWith("Debug:Tick"));
    if (tag) player.runCommand(`tag @s remove ${tag}`);

    player.runCommand(`tag @s add Debug:Tick_Player:${component}`);
  });
}

/**
 * @param {import("mojang-minecraft").Player} player
 */
function BlockInfoTick(player) {
  const blockSelection = ["General", "State"];
  const blockConfigForm = new ModalFormData()
    .title("Block : Info-Tick Configuration")
    .toggle("Component Selection\n§8[§cDropdown§8/§aText Field§8]", false)
    .dropdown("Information List", blockSelection)
    .textField("Component Name §8[Capitalize]", "Component");

  blockConfigForm.show(player).then((response) => {
    if (response.canceled) {
      return Print(CancelReason(response.cancelationReason));
    }
    let [select, opt, text] = response.formValues;
    let component = select ? blockSelection[opt] : text;

    let tag = player.getTags().find((tag) => tag.startsWith("Debug:Tick"));
    if (tag) player.runCommand(`tag @s remove ${tag}`);

    player.runCommand(`tag @s add Debug:Tick_Block:${component}`);
  });
}
