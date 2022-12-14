// TODO: Not implemented
import { world } from "@minecraft/server";
import CustomCommand from "./CustomCommand";

function commandItem(player, data) {
  console.log(data);
}

CustomCommand.addCommand({
  name: "item",
  description:
    "Manipulate or copy items in the inventories of blocks (chest, furnaces, etc.) or entities (players or mobs).",
  operator: true,
  arguments: [
    {
      name: "opt",
      description: "Option of item's command.",
      type: "option",
      list: [
        {
          name: "give",
          description: "Give the item to entities (players or mobs).",
          subcommand: [
            {
              name: "target",
              description: "The entity to which the item is to be assigned.",
              type: "selector",
              options: {
                type: "player",
              },
            },
          ],
        },
        {
          name: "spawn",
          description: "Spawn the item at specific location.",
          subcommand: [
            {
              name: "position",
              description: "The location where the item will appear.",
              type: "location",
            },
          ],
        },
      ],
    },
    {
      name: "item",
      description: "The item's identifier.",
      type: "item",
    },
    {
      name: "amount",
      description: "The item's amount.",
      type: "number",
      options: {
        float: false,
        min: 0,
        max: 64,
      },
      default: 1,
    },
    {
      name: "component",
      description: "The item's components (Sort of NBT Data).",
      type: "object",
      default: {},
    },
  ],
  callback: commandItem,
});
