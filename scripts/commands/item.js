import { ItemStack, ItemTypes, Player, world } from "@minecraft/server";
import CustomCommand from "./CustomCommand";
import { AddEnchantment } from "../lib/Enchantments";

// Example Item Component (JSON Component)
const __ItemComponent = {
  // Default Item Component [Java Syntax]
  CanDestroy: ["wool", "brick"],
  CanPlaceOn: ["stone", "wood"],
  ItemLock: "lock_in_slot" /* or "lock_in_inventory" */,
  KeepOnDeath: {},
  // Default Item Component [Bedrock Syntax]
  "minecraft:can_destroy": { blocks: ["wool", "stone"] },
  "minecraft:can_place_on": { blocks: ["wool", "stone"] },
  "minecraft:item_lock": { mode: "lock_in_slot" /* or "lock_in_inventory" */ },
  "minecraft:keep_on_death": {},
  // Additional Item Component
  Data: 0,
  Display: {
    Name: "Item Name",
    Lore: ["First Line", "Second Line"],
  },
  Enchantment: [
    {
      id: "unbreaking",
      lvl: 4,
    },
    {
      id: "mending",
      lvl: 1,
    },
  ],
  ExplorationMap: "ancient_city" /* For Map Only */,
};

CustomCommand.addCommand({
  name: "item",
  description:
    "Manipulate or copy items in the inventories of blocks (chest, furnaces, etc.) or entities (players or mobs).",
  operator: true,
  arguments: [
    {
      name: "selection",
      description: "Option of item's command.",
      type: "option",
      choices: [
        {
          name: "give",
          description: "Give the item to entities (players or mobs).",
          // subargument: [
          //   {
          //     name: "target",
          //     description: "The entity to which the item is to be assigned.",
          //     type: "selector",
          //     options: {
          //       type: "player",
          //     },
          //   },
          // ],
        },
        {
          name: "spawn",
          description: "Spawn the item at specific location.",
          subargument: [
            {
              name: "position",
              description: "The location where the item will appear.",
              type: "location",
              options: {
                outputData: "Vector3",
              },
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
      name: "components",
      description: "The item's components (Sort of NBT Data).",
      type: "object",
      default: {},
    },
  ],
  callback: ItemCommand,
});

/**
 * @param {Player} player
 * @param {object} data
 */
function ItemCommand(player, data) {
  const selection = data.arguments.selection;

  switch (selection) {
    case "give":
      ItemGive(player, data);
      break;

    case "spawn":
      ItemSpawn(player, data);
      break;

    default:
      break;
  }
}

/**
 * @param {Player} player
 * @param {string} data
 */
function ItemGive(player, data) {
  const {
    arguments: { item: name, amount, components },
  } = data;

  const dataValue = "Data" in components ? components["Data"] : 0;
  const inventory = player.getComponent("minecraft:inventory").container;

  // Find empty slot
  let emptySlot = -1;
  for (let i = 0; i < inventory.size; i++) {
    if (!inventory.getItem(i)) {
      emptySlot = i;
      break;
    }
  }
  // [Error-Log] You don't have an empty slot
  if (emptySlot < 0) {
    return player.tell("§c[Error]§r You don't have an empty slot");
  }

  let NBTComp = {};

  // "CanDestroy" (minecraft:can_destroy) Component
  if ("CanDestroy" in components || "minecraft:can_destroy" in components) {
    let destroyBlock = [];
    destroyBlock.concat(
      "CanDestroy" in components ? components["CanDestroy"] : []
    );
    destroyBlock.concat(
      "minecraft:can_destroy" in components
        ? components["minecraft:can_destroy"]["blocks"]
        : []
    );
    NBTComp = { ...NBTComp, "minecraft:can_destroy": { blocks: destroyBlock } };
  }

  // "CanPlaceOn" (minecraft:can_place_on) Component
  if ("CanPlaceOn" in components || "minecraft:can_place_on" in components) {
    let placeBlock = [];
    placeBlock.concat(
      "CanPlaceOn" in components ? components["CanPlaceOn"] : []
    );
    placeBlock.concat(
      "minecraft:can_place_on" in components
        ? components["minecraft:can_place_on"]["blocks"]
        : []
    );
    NBTComp = { ...NBTComp, "minecraft:can_place_on": { blocks: placeBlock } };
  }

  // "ItemLock" (minecraft:item_lock) Component
  if ("ItemLock" in components && "minecaft:item_lock" in components) {
    if (components["ItemLock"] !== components["minecraft:item_lock"]["mode"])
      return player.tell(
        "§c[Error]§r 'ItemLock' and 'mineraft:item_lock' component have mismatch value"
      );
    else
      NBTComp = {
        ...NBTComp,
        "minecraft:item_lock": components["minecraft:item_lock"],
      };
  } else if ("ItemLock" in components || "minecaft:item_lock" in components)
    if ("minecraft:item_lock" in components)
      NBTComp = {
        ...NBTComp,
        "minecraft:item_lock": { mode: components["ItemLock"] },
      };
    else
      NBTComp = {
        ...NBTComp,
        "minecraft:item_lock": components["minecraft:item_lock"],
      };

  // "KeepOnDeath" (minecraft:keep_on_death) component
  if ("KeepOnDeath" in components || "minecraft:keep_on_death" in components)
    NBTComp = { ...NBTComp, "minecraft:keep_on_death": {} };

  // Check if the item is "map" and there's "ExplorationMap" component
  if (
    name.replace("minecraft:", "") === "map" &&
    "ExplorationMap" in components
  )
    return player.tell(
      "§a[Info]§r Command cannot run properly due to unfinish function with 'ExplorationMap' component"
    );

  // Give the item to player
  player.runCommandAsync(
    `give @s ${name} ${amount} ${dataValue} ${
      NBTComp.length > 0 ? JSON.stringify(NBTComp) : ""
    }`
  );

  // Take the item as "ItemStack" class
  const oldItem = inventory.getItem(emptySlot);
  const newItem = ItemPropertyUpdate(oldItem, components);

  // Set back to player
  inventory.setItem(emptySlot, newItem);

  player.tell(`Successfully give ${amount} ${name} to ${player.name}`);
}

/**
 * @param {Player} player
 * @param {String} data
 */
function ItemSpawn(player, data) {
  const {
    arguments: { position, item: name, amount, components },
  } = data;

  const dataValue = components["Data"] ?? 0;

  const initItem = new ItemStack(
    ItemTypes.get(name),
    parseInt(amount),
    parseInt(dataValue)
  );
  const readyItem = ItemPropertyUpdate(initItem, components);

  player.dimension.spawnItem(readyItem, position);

  player.tell(
    `Successfully spawn ${amount} ${name} at ${position.x}, ${position.y}, ${position.z}`
  );
}

/**
 * @param {ItemStack} itemStack
 * @param {object} itemComp
 * @return {ItemStack}
 */
function ItemPropertyUpdate(itemStack, itemComp) {
  if ("Display" in itemComp) {
    if ("Name" in itemComp["Display"])
      itemStack.nameTag = itemComp["Display"]["Name"];

    if ("Lore" in itemComp["Display"])
      itemStack.setLore(itemComp["Display"]["Lore"]);
  }

  if ("Enchantment" in itemComp) {
    for (const enchant of itemComp["Enchantments"]) {
      AddEnchantment(itemStack, enchant["id"], enchant["lvl"] ?? 1);
    }
  }

  return itemStack;
}
