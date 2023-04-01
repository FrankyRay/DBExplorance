import { world, system, Player } from "@minecraft/server";
import {
  ActionFormData,
  MessageFormData,
  ModalFormData,
} from "@minecraft/server-ui";
import InformationForm from "./Information";
import * as Comp from "./Component";

/**
 * @param {Player} player
 */
export default function entityForm(player) {
  const entity = player.getEntitiesFromViewDirection({ maxDistance: 5 })[0];
  if (!entity)
    return player.onScreenDisplay.setActionBar(
      "[INFO] There's no entity in front of you!"
    );
  if (entity instanceof Player)
    return player.onScreenDisplay.setActionBar(
      "[INFO] Entity must not player!"
    );

  const initForm = new ActionFormData()
    .title(`${entity.nameTag} (${entity.typeId.replace("minecraft:", "")})`)
    .body(
      `ID: ${entity.id}\nLocation: ${Object.values(entity.location)
        .map((loc) => loc.toFixed(2))
        .join(" | ")}\nRotation: ${Object.values(entity.getRotation())
        .map((loc) => loc.toFixed(2))
        .join(" | ")}`
    )
    .button("Entity Information\n§8[General and Components]")
    .button("'OnFire' Component\n§8[minecraft:on_fire]");

  initForm.show(player).then((data) => {
    if (data.canceled) return;

    switch (data.selection) {
      case 0:
        InformationForm(player, entity);
        break;

      case 1:
        Comp.componentOnFire(player, entity);
        break;
    }
  });
}
