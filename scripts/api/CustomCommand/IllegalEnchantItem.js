// @ts-check
import { MinecraftEnchantmentTypes, world } from "@minecraft/server";

/**
 * Check the illegal enchantment on item
 * @param {import("@minecraft/server").Player} player
 */
export default function IllegalEnchantmentItem(player) {
  /**
   * @type {import("@minecraft/server").InventoryComponentContainer}
   */
  // @ts-ignore
  let inventory = player.getComponent("inventory").container;

  let message = `Illegal Enchantments Item Check [Player ID: ${player.name}]`;
  for (let i = 0; i < 36; i++) {
    let item = inventory.getItem(i);
    if (!item) continue;

    /**
     * @type {import("@minecraft/server").EnchantmentList}
     */
    let enchantments = item.getComponent("enchantments").enchantments;
  }
}
