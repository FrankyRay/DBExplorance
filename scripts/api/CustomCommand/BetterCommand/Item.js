// Work In Progress
import {
  ItemStack,
  ItemTypes,
  Location,
  Player,
  world,
} from "mojang-minecraft";
import Print from "../../../lib/Print.js";
import { AddEnchantment } from "../../../lib/Enchantments.js";

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

/**
 * @param {Player} player
 * @param {string} args
 */
export default function ItemCommand(player, args) {
  const [itemCommandType, ...anotherArgs] = args;

  switch (itemCommandType) {
    case "give":
      ItemGive(player, anotherArgs);
      break;

    case "spawn":
      ItemSpawn(player, anotherArgs);
      break;

    default:
      break;
  }
}

/**
 * @param {Player} player
 * @param {string} args
 */
function ItemGive(player, args) {
  const name = args[0];

  const amount = args[1] ?? 1;
  // [Error-Log] Amount is not a number
  if (isNaN(parseInt(amount)))
    return Print(`§c[Error]§r Amount is not a number`);
  else if (parseInt(amount) > 64)
    return Print(`§c[Error]§r Exceeding max amount [${amount} / 64]`);

  // const strComp = args.match(/(\{(.*)\})/g)?.toString() ?? "{}";
  try {
    JSON.parse(args[2]);
  } catch (err) {
    // [Error-Log] Failed to parse JSON Object
    return Print(`§c[Error]§r Failed to parse JSON Object`);
  }
  const itemComp = JSON.parse(args[2]);

  const dataValue = "Data" in itemComp ? itemComp["Data"] : 0;
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
    return Print("§c[Error]§r You don't have an empty slot");
  }

  let NBTComp = {};

  // "CanDestroy" (minecraft:can_destroy) Component
  if ("CanDestroy" in itemComp || "minecraft:can_destroy" in itemComp) {
    let destroyBlock = [];
    destroyBlock.concat("CanDestroy" in itemComp ? itemComp["CanDestroy"] : []);
    destroyBlock.concat(
      "minecraft:can_destroy" in itemComp
        ? itemComp["minecraft:can_destroy"]["blocks"]
        : []
    );
    NBTComp = { ...NBTComp, "minecraft:can_destroy": { blocks: destroyBlock } };
  }

  // "CanPlaceOn" (minecraft:can_place_on) Component
  if ("CanPlaceOn" in itemComp || "minecraft:can_place_on" in itemComp) {
    let placeBlock = [];
    placeBlock.concat("CanPlaceOn" in itemComp ? itemComp["CanPlaceOn"] : []);
    placeBlock.concat(
      "minecraft:can_place_on" in itemComp
        ? itemComp["minecraft:can_place_on"]["blocks"]
        : []
    );
    NBTComp = { ...NBTComp, "minecraft:can_place_on": { blocks: placeBlock } };
  }

  // "ItemLock" (minecraft:item_lock) Component
  if ("ItemLock" in itemComp && "minecaft:item_lock" in itemComp) {
    if (itemComp["ItemLock"] !== itemComp["minecraft:item_lock"]["mode"])
      return Print(
        "§c[Error]§r 'ItemLock' and 'mineraft:item_lock' component have mismatch value"
      );
    else
      NBTComp = {
        ...NBTComp,
        "minecraft:item_lock": itemComp["minecraft:item_lock"],
      };
  } else if ("ItemLock" in itemComp || "minecaft:item_lock" in itemComp)
    if ("minecraft:item_lock" in itemComp)
      NBTComp = {
        ...NBTComp,
        "minecraft:item_lock": { mode: itemComp["ItemLock"] },
      };
    else
      NBTComp = {
        ...NBTComp,
        "minecraft:item_lock": itemComp["minecraft:item_lock"],
      };

  // "KeepOnDeath" (minecraft:keep_on_death) component
  if ("KeepOnDeath" in itemComp || "minecraft:keep_on_death" in itemComp)
    NBTComp = { ...NBTComp, "minecraft:keep_on_death": {} };

  // Check if the item is "map" and there's "ExplorationMap" component
  if (name.replace("minecraft:", "") === "map" && "ExplorationMap" in itemComp)
    return Print(
      "§a[Info]§r Command cannot run properly due to unfinish function with 'ExplorationMap' component"
    );

  // Give the item to player
  player.runCommand(
    `give @s ${name} ${amount} ${dataValue} ${
      NBTComp.length > 0 ? JSON.stringify(NBTComp) : ""
    }`
  );

  // Take the item as "ItemStack" class
  const oldItem = inventory.getItem(emptySlot);
  const newItem = ItemPropertyUpdate(oldItem, itemComp);

  // Set back to player
  inventory.setItem(emptySlot, newItem);

  Print(`Successfully give ${amount} ${name} to ${player.name}`);
}

/**
 * @param {Player} player
 * @param {String} args
 */
function ItemSpawn(player, args) {
  const [x, y, z, name] = args;

  const amount = args[4] ?? 1;
  // [Error-Log] Amount is not a number
  if (isNaN(parseInt(amount)))
    return Print(`§c[Error]§r Amount is not a number`);
  else if (parseInt(amount) > 64)
    return Print(`§c[Error]§r Exceeding max amount [${amount} / 64]`);

  // const strComp = args.match(/(\{(.*)\})/g)?.toString() ?? "{}";
  try {
    JSON.parse(args[5]);
  } catch (err) {
    // [Error-Log] Failed to parse JSON Object
    return Print(`§c[Error]§r Failed to parse JSON Object`);
  }
  const itemComp = JSON.parse(args[5]);

  const dataValue = itemComp["Data"] ?? 0;

  const initItem = new ItemStack(
    ItemTypes.get(name),
    parseInt(amount),
    parseInt(dataValue)
  );
  const readyItem = ItemPropertyUpdate(initItem, itemComp);

  player.dimension.spawnItem(
    readyItem,
    new Location(parseInt(x), parseInt(y), parseInt(z))
  );

  Print(`Successfully spawn ${amount} ${name} at ${x}, ${y}, ${z}`);
}

/**
 * @param {ItemStack} itemStack
 * @param {Object} itemComp
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
