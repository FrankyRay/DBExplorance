import CustomCommand from "./CustomCommand";
import { Player, ItemStack } from "@minecraft/server";

CustomCommand.addCommand({
  name: "coordinate",
  description: "Calculate world location offset by using player's location",
  aliases: ["coord"],
  arguments: [
    {
      name: "location",
      description: "Location offset or absolute location",
      type: "location",
      default: null,
    },
  ],
  /**
   * @param {Player} player
   * @param {Object} data
   */
  callback: (player, data) => {
    if (!data.arguments.location) {
      player.sendMessage(
        `Location
  X = ${player.location.x}
  Y = ${player.location.y}
  Z = ${player.location.z}
Rotation
  X = ${player.getRotation().x}
  Y = ${player.getRotation().y}`
      );
    } else {
      player.sendMessage(
        `Possible location
  X = ${data.arguments.location.x}
  Y = ${data.arguments.location.y}
  Z = ${data.arguments.location.z}`
      );
    }
  },
});

CustomCommand.addCommand({
  name: "entityform",
  description: "-",
  arguments: {},
  /**
   * @param {Player} player
   * @param {Object} data
   */
  callback: (player, data) => {
    const item = new ItemStack("minecraft:book", 1);
    item.setLore(["§rUsage: EntityInteraction"]);

    player.getComponent("inventory").container.addItem(item);
  },
});
