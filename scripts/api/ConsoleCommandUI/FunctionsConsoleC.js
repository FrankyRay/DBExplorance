import { world } from "mojang-minecraft";
import {
  ActionFormData,
  MessageFormData,
  ModalFormData,
} from "mojang-minecraft-ui";
import Print from "../../lib/Print";

export function Ability(player) {
  let abilities = ["Mayfly", "Worldbuilder", "Mute"];
  let form = new ModalFormData()
    .title("Ability Command")
    .textField("Target Selector §e[Player]", "Target Selector")
    .dropdown("Ability", abilities, 0)
    .toggle("Value\n§8[§cFalse§8/§aTrue§8]")
    .toggle("§9Command Syntax\n§8[§cHide§8/§aShow§8]", false);

  form.show(player).then((response) => {
    if (response.isCanceled) return;
    let [target, ability, value, syntax] = response.formValues;

    let command = `ability ${target} ${abilities[
      ability
    ].toLowerCase()} ${value}`;
    player.runCommand(command);

    if (syntax) Print(command, player.name, "ConsoleCommandSyntax");
  });
}

export function Give(player) {
  let form = new ModalFormData()
    .title("Give Command")
    .textField("Target Selector §e[Player]", "Target Selector")
    .textField("Item", "Item Identifier")
    .textField("Amount §8[Optional]", "Item Amount", "1")
    .textField("Data Value §8[Optional]", "Item Data Value", "0")
    .textField("JSON Components §8[Optional]", "Item Components", "{}")
    .toggle("§9Command Syntax\n§8[§cHide§8/§aShow§8]", false);

  form.show(player).then((response) => {
    if (response.isCanceled) return;
    let [target, item, amount, data, comp, syntax] = response.formValues;

    let command = `give ${target} ${item} ${amount} ${data} ${comp}`;
    player.runCommand(command);

    if (syntax) Print(command, player.name, "ConsoleCommandSyntax");
  });
}
