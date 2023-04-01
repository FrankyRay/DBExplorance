import { Player } from "@minecraft/server";
import CustomCommand from "./CustomCommand";

CustomCommand.addCommand({
  name: "explosion",
  description: "Creating explosion in the specific location",
  operator: true,
  arguments: [
    {
      name: "location",
      description: "The location of the explosion.",
      type: "location",
      options: {
        outputData: "Vector3",
      },
    },
    {
      name: "radius",
      description: "Radius, in blocks, of the explosion to create.",
      type: "number",
      options: {
        floatType: false,
      },
    },
    {
      name: "causesFire",
      description:
        "The explosion is accompanied by fires within or near the blast radius.",
      type: "boolean",
      default: true,
    },
    {
      name: "breakBlocks",
      description:
        "Whether the explosion will break blocks within the blast radius.",
      type: "boolean",
      default: true,
    },
    {
      name: "allowUnderwater",
      description: "Whether parts of the explosion also impact underwater.",
      type: "boolean",
      default: true,
    },
  ],
  callback: explodeCommand,
});

/**
 * @param {Player} player
 * @param {object} data
 */
function explodeCommand(player, data) {
  player.dimension.createExplosion(
    data.arguments.location,
    data.arguments.radius,
    {
      allowUnderwater: data.arguments.allowUnderwater,
      breaksBlocks: data.arguments.breaksBlocks,
      causesFire: data.arguments.causesFire,
    }
  );
}
