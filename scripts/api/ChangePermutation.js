import { world } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import Print from "../lib/Print";

world.events.beforeItemUseOn.subscribe((eventItem) => {
  const { item, source, blockLocation, cancel } = eventItem;
  // const blockRayOpt = new BlockRaycastOptions();
  // blockRayOpt.maxDistance = 10;

  // const block = source.getBlockFromViewVector(blockRayOpt);
  const block = source.dimension.getBlock(blockLocation);
  if (
    item.id == "minecraft:netherite_sword" &&
    item.getLore().includes("§r§g[Change Permutation UI]")
  ) {
    changePermutationBlock(source, block);
    eventItem.cancel = true;
  }
});

/**
 * Change permutation
 * @param {import("@minecraft/server").Player} player Player Class
 * @param {import("@minecraft/server").Block} block Block
 */
function changePermutationBlock(player, block) {
  const permutationForm = new ModalFormData().title(
    `Permutation [${block.id}]`
  );
  const permutate = block.permutation;

  const properties = permutate.getAllProperties();
  if (properties.length == 0) return Print("Block has no any property!");
  for (let property of properties) {
    let { name, validValues, value } = property;

    switch (typeof value) {
      case "string":
        permutationForm.dropdown(
          name,
          validValues.map((n) => n),
          validValues.indexOf(value)
        );
        break;

      case "number":
        permutationForm.slider(name, 0, validValues.length - 1, 1, value);
        break;

      case "boolean":
        permutationForm.toggle(name, value);
        break;
    }
  }
  permutationForm.show(player).then((response) => {
    if (response.isCanceled || response.canceled) return;
    for (let propertyIndex in properties) {
      let { name, validValues, value } = properties[propertyIndex];

      switch (typeof value) {
        case "string":
          permutate.getProperty(name).value =
            validValues[response.formValues[propertyIndex]];
          break;

        default:
          permutate.getProperty(name).value =
            response.formValues[propertyIndex];
      }
    }

    block.setPermutation(permutate);
  });
}
