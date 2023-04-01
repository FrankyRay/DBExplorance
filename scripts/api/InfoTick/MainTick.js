import "./MainConfig";
import { world } from "@minecraft/server";

world.events.tick.subscribe((tick) => {
  for (const player of world.getPlayers()) {
    let debugTag = player.getTags().find((tag) => tag.startsWith("Debug:Tick"));
    if (debugTag === undefined || debugTag === "Debug:Tick_Disable") return;

    let [main, type] = debugTag.substring(debugTag.indexOf("_") + 1).split(":");

    let message = "";
    switch (main) {
      case "Player":
        message = PlayerTick(player, type);
        break;

      case "Block":
        message = BlockTick(player, type);
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
 * @param {import("@minecraft/server").Player} player
 * @param {string} type
 */
function PlayerTick(player, type) {
  let message = `Player's Component Info [ /infotick ]{ ${type} }`;
  switch (type) {
    case "General":
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
      message += `\nDimension: ${id}\nHead Location: { ${headX.toFixed(
        5
      )} | ${headY.toFixed(5)} | ${headZ.toFixed(5)} }\nSneaking: ${
        isSneaking ? "True" : "False"
      }\nLocation: { ${x.toFixed(5)} | ${y.toFixed(5)} | ${z.toFixed(
        5
      )} }\nName: ${name} (${nameTag})\nRotation: { ${rotX.toFixed(
        5
      )} | ${rotY.toFixed(
        5
      )} }\nSelected Slot: ${selectedSlot}\nVelocity: { ${velX.toFixed(
        5
      )} | ${velY.toFixed(5)} | ${velZ.toFixed(
        5
      )} }\nView Vector: { ${vecX.toFixed(5)} | ${vecY.toFixed(
        5
      )} | ${vecZ.toFixed(5)} }`;
      break;

    case "List":
      player.getComponents().forEach((comp) => {
        message += `\n- ${comp.id}`;
      });
      break;

    case "Health":
      let { current, value } = player.getComponent("health");
      message += `\nCurrent: ${current}\nValue: ${value}`;

    default:
      let available = player.hasComponent(type.toLowerCase());
      message += `\nIs Available: ${available}`;
  }

  return message;
}

/**
 * @param {import("@minecraft/server").Player} player
 * @param {string} type
 */
function BlockTick(player, type) {
  let blockOption = {
    includeLiquidBlocks: true,
    includePassableBlocks: true,
    maxDistance: 10,
  };

  let block = player.getBlockFromViewVector(blockOption);
  if (!block) return "Block's Component Info [ /infotick ]< Block Empty >";

  let message = `Block's Component Info [ /infotick ]{ ${type} }`;
  switch (type) {
    case "General":
      let {
        dimension: { id: dimID },
        id,
        isWaterlogged,
        x,
        y,
        z,
      } = block;
      message += `\nBlock ID: ${id}\nDimension: ${dimID}\nWaterlogged: ${isWaterlogged}\nLocation: { ${x} | ${y} | ${z} }`;
      break;

    case "State":
      let properties = block.permutation.getAllProperties();

      message += `\nBlock ID: ${block.id}`;
      for (let property of properties) {
        let { name, validValues, value } = property;

        switch (typeof value) {
          case "string":
            let valuesType = [];
            let valuesMsg = "";
            let charCount = 0;
            for (let i = 0; i < validValues.length; i++) {
              // @ts-ignore
              charCount += validValues[i].length;
              valuesType.push(
                validValues[i] == value
                  ? `§c'${validValues[i]}'§r`
                  : `'${validValues[i]}'`
              );
            }
            if (charCount > 85) {
              let valueIndex = validValues.indexOf(value);
              if (valueIndex == 0)
                valuesMsg = `${valuesType[valueIndex]}, ${
                  valuesType[valueIndex + 1]
                }, ${valuesType[valueIndex + 2]} ...`;
              else if (valueIndex == validValues.length)
                valuesMsg = `... ${valuesType[valueIndex - 2]}, ${
                  valuesType[valueIndex - 1]
                }, ${valuesType[valueIndex]}`;
              else
                valuesMsg = `... ${valuesType[valueIndex - 1]}, ${
                  valuesType[valueIndex]
                }, ${valuesType[valueIndex + 1]} ...`;
            } else valuesMsg = valuesType.join(", ");
            message += `\n§e${name} §7(${typeof value}) [${
              validValues.length
            }] [${charCount}]\n§r[ ${valuesMsg} ]`;
            break;

          case "number":
            message += `\n§e${name} §7(${typeof value})\n§c${value}§r [0 - ${
              validValues.length - 1
            }]`;
            break;

          case "boolean":
            let valueF = value === true ? "§atrue§r" : "§cfalse§r";
            message += `\n§e${name} §7(${typeof value})\n${valueF}`;
            break;
        }
      }
      break;

    default:
      let available = block.getComponent(type.toLowerCase()) ? true : false;
      message += `\nIs Available: ${available}`;
  }

  return message;
}
