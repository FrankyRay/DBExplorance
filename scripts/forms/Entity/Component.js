import { world, Player, Entity } from "@minecraft/server";
import {
  ActionFormData,
  MessageFormData,
  ModalFormData,
} from "@minecraft/server-ui";

/**
 * @param {Player} player
 * @param {Entity} target
 */
export function componentOnFire(player, target) {
  const formOnFire = new ModalFormData()
    .title(`${target.nameTag} [minecraft:on_fire]`)
    .textField("Fire Duration §8[Optional]", "In Seconds")
    .toggle("Visual Effect\n§8[§cHide§8/§aShow§8]", false);

  formOnFire.show(player).then((data) => {
    if (data.canceled) return;
    const [seconds, useEffects] = data.formValues;

    // [!] "Seconds" is not a valid number
    if (isNaN(Number(seconds))) {
      player.sendMessage(`[Error] Fire Duration is not a valid number`);
    }

    if (!seconds) {
      target.extinguishFire(useEffects);
      player.sendMessage(
        `Successfully extinguish fire from ${target.nameTag}!`
      );
    } else {
      target.setOnFire(Number(seconds), useEffects);
      player.sendMessage(
        `Successfully set ${target.nameTag} on fire for ${seconds} second(s)!`
      );
    }
  });
}
