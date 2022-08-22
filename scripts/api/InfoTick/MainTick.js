// @ts-check
import { world } from "mojang-minecraft";

world.events.tick.subscribe((tick) => {
  for (const player of world.getPlayers()) {
    let debugTag = player.getTags().find((tag) => tag.startsWith("Debug:Tick"));
    if (debugTag === undefined || debugTag === "Debug:Tick/Disable") return;

    let [main, type] = debugTag.substring(debugTag.indexOf("/") + 1).split(":");

    let message = "";
    switch (main) {
      case "Player":
        message = PlayerTick(player, type);
        break;

      default:
        message = "Not available yet!";
    }

    player.runCommand(
      `titleraw @s actionbar {"rawtext": [{"text": "${message}"}]}`
    );
  }
});

/**
 * @param {import("mojang-minecraft").Player} player
 * @param {string} type
 */
function PlayerTick(player, type) {
  let message = "Player's Component Info [/infotick]";
  switch (type) {
    case "General":
      message += "\nType: General";
      let {
        dimension: { id },
        headLocation: { x: headX, y: headY, z: headZ },
        isSneaking,
        // level,
        location: { x, y, z },
        name,
        nameTag,
        // nickname,
        rotation: { x: rotX, y: rotY },
        selectedSlot,
        // uid,
        velocity: { x: velX, y: velY, z: velZ },
        viewVector: { x: vecX, y: vecY, z: vecZ },
      } = player;
      message += `\nDimension: ${id}\nHead Location: { ${headX} | ${headY} | ${headZ} }\nSneaking: ${isSneaking}\nLocation: { ${x} | ${y} | ${z} }\nName: ${name} (${nameTag})\nRotation: { ${rotX} | ${rotY} }\nSelected Slot: ${selectedSlot}\nVelocity: { ${velX} | ${velY} | ${velZ} }\nView Vector: { ${vecX} | ${vecY} | ${vecZ} }`;
      break;

    case "List":
      break;
  }

  return message;
}
