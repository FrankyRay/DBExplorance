// Work In Progress
import { Player, world } from "mojang-minecraft";
import Print from "../../lib/Print.js";
import { AddEnchantment } from "../../lib/Enchantments.js";
import ItemGive from "../ItemGive";

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
  const itemCommandType = args.split(" ")[0];

  switch (itemCommandType) {
    case "give":
      ItemGive(player, args.substring(args.indexOf(" ") + 1));
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
  const name = args.split(" ")[0];

  const amount = args.split(" ")[1] ?? 1;
  // [Error-Log] Amount is not a number
  if (isNan(parseInt(amount)))
    return Print(
      `§c[Error]§r Amount is not a number (at ${args.substring(
        args.indexOf(amount) - 3,
        args.indexOf(amount) + 3
      )})`
    );

  const strComp = args.match(/(\{(.*)\})/g)?.toString() ?? "{}";
  try {
    const itemComp = JSON.parse(strComp);
  } catch (err) {
    // [Error-Log] Failed to parse JSON Object
    return Print(`§c[Error]§r Failed to parse JSON Object`);
  }

  const dataValue = "Data" in itemComp ? itemComp["Data"] : 0;
  const inventory = player.getComponent("minecraft:inventory").container;

  // Find empty slot
  let emptySlot = -1;
  for (let i = 0; i < container.size; i++) {
    if (!inventory.getItem(i)) {
      emptySlot = i;
      break;
    }
  }
  // [Error-Log]
}
