import { world, Player, Entity } from "@minecraft/server";
import {
  ActionFormData,
  ModalFormData,
  MessageFormData,
} from "@minecraft/server-ui";

/**
 * @param {Player} player
 * @param {Entity} target
 */
export default function informationForm(player, target) {
  const infoForm = new ActionFormData()
    .title(`${target.nameTag} [Information]`)
    .body("Select the component to see detail")
    .button("General Information");

  const components = target.getComponents();
  for (let i = 0; i < components.length; i++) {
    const comp = components[i];

    infoForm.button(`Component Information\n§1[${comp.typeId}]`);
  }

  infoForm.show(player).then((data) => {
    if (data.canceled) return;
    player.sendMessage("Process")
    if (data.selection > 0) return;
    let targetData = "Properties:\n\n";

    for (const [key, val] in Object.entries(Object.getPrototypeOf(target))) {
      targetData += fetchProperty(key, val);
    }

    player.sendMessage("Open Form")
    new MessageFormData()
      .title(`${target.nameTag} [General]`)
      .body(targetData)
      .button1("OK")
      .button2("Cancel")
      .show(player)
      .then();
    player.sendMessage("")
  });
}

function fetchProperty(key, val) {
  let messageLine = [];
  switch (typeof val) {
    case "string":
      messageLine += "§a" + JSON.stringify(val);
      break;

    case "number":
      messageLine += "§b" + val;
      break;

    case "boolean":
      messageLine += "§c" + val;
      break;

    case "object":
      if (val.constructor.name === "Object")
        messageLine += "§e" + JSON.stringify(val);
      else messageLine += "§e" + `{ [Native] "${val.constructor.name}" }`;
      break;
  }

  return `§9${key}: §8${typeof val} = ` + messageLine.join("\n\n") + "\n\n";
}
