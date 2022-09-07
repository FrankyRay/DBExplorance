// @ts-check
import { MinecraftEnchantmentTypes, world } from "mojang-minecraft";

/**
 * Check the illegal enchantment on item
 * @param {import("mojang-minecraft").Player} player
 */
export default function IllegalEnchantmentItem(player) {
  /**
   * @type {import("mojang-minecraft").InventoryComponentContainer}
   */
  // @ts-ignore
  let inventory = player.getComponent("inventory").container;

  let message = `Illegal Enchantments Item Check [Player ID: ${player.name}]`;
  for (let i = 0; i < 36; i++) {
    let item = inventory.getItem(i);
    if (!item) continue;

    /**
     * @type {import("mojang-minecraft").EnchantmentList}
     */
    let enchantments = item.getComponent("enchantments").enchantments;
  }
}
