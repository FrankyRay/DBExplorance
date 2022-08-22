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
    .button("Player")
    .button("Block")
    .button("Item")
    .button("Entity");

  configForm.show(player).then((response) => {
    if (response.canceled)
      return console.warn(CancelReason(response.cancelationReason));

    switch (response.selection) {
      case 0:
        PlayerInfoTick(player);
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
  const playerSelection = ["General", "List"];
  const playerConfigForm = new ModalFormData()
    .title("Player : Info-Tick Configuration")
    .dropdown("Information List", playerSelection);

  playerConfigForm.show(player).then((response) => {
    if (response.canceled)
      return console.warn(CancelReason(response.cancelationReason));
    let [info] = response.formValues();

    let tag = player.getTags().find((tag) => tag.startsWith("Debug:Tick"));
    if (tag) player.removeTag(tag);

    player.addTag(`Debug:Tick/Player:${playerSelection[info]}`);
  });
}
