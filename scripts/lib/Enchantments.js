import { world } from "@minecraft/server";

/**
 * Add enchantment to the item
 * @param {import("@minecraft/server").ItemStack} item The Item Class
 * @param {string} enchantID Enchantment ID. For example `"unbreaking"` or `"mending"`
 * @param {number} enchantLevel Enchantment Level. The level can't be exceed the normal enchantment value. Default value: 1.
 */
export function AddEnchantment(item, enchantID, enchantLevel = 1) {
  let itemEnchant = item.getComponent("enchantments").enchantments;
  itemEnchant.addEnchantment(
    new Enchantment(MinecraftEnchantmentTypes[enchantID], enchantLevel)
  );
  // Set new EnchantmentList to item
  item.getComponent("enchantments").enchantments = itemEnchant;
}

/**
 * Get every enchantments on the item and mapping into Object
 * @param {import("@minecraft/server").ItemStack} item The Item Class
 * @return {object[]} Array of object contain every enchantments id and lvl
 */
export function GetEnchantment(item) {
  let enchant = item.getComponent("enchantments").enchantments;
  let encPos = enchant.next();
  let encList = [];

  while (!encPos.done) {
    if (enchant.hasEnchantment(encPos.value.type)) {
      let enc = enchant.getEnchantment(encPos.value.type);
      encList.push({ id: enc.type.id, lvl: enc.level });
    }
  }

  return encList;
}
