import { world } from "mojang-minecraft";
import { ModalFormData } from "mojang-minecraft-ui";
import Print from "../lib/Print";

world.events.beforeItemUseOn.subscribe((eventItem) => {
  const { blockLocation, item, source } = eventItem;
  const block = source.dimension.getBlock(blockLocation);

  if (
    item.id == "minecraft:book" &&
    item.getLore().includes("§r§g[Change Permutation UI]")
  ) {
    changePermutationBlock(source, block);
  }
});

/**
 * Change permutation
 * @param {import("mojang-minecraft").Player} player Player Class
 * @param {import("mojang-minecraft").Block} block Block
 */
function changePermutationBlock(player, block) {
  const permutationForm = new ModalFormData().title(
    `Permutation [${block.id}]`
  );
  const permutate = block.permutation;

  const properties = permutate.getAllProperties();
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

    permutationForm.show(player).then((response) => {
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
}
