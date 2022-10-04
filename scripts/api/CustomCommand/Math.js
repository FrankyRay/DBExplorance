// @ts-check
import { world } from "mojang-minecraft";
import Print from "../../lib/Print";

const mathSymbol = ["+", "-", "*", "/", "%"];

/**
 * Math function for custom command `/math`
 *
 * @param {import("mojang-minecraft").Player} player
 * @param {string} args
 */
export default function Math(player, args) {
  let [subcommand, equation] = args;
  let result = 0;

  switch (subcommand) {
    case "eq":
      // Test if the equation has one of math symbol
      if (!mathSymbol.some((val) => equation.includes(val))) {
        Print("Not a equation!");
        return;
      }

      result = eval(equation);
      Print(`Math Command:\n§e${equation}§r\n  = §c${result}`);
      break;

    case "add":
      // @ts-ignore - Result thinks that num is string
      let numListAdd = equation.split(" ");
      numListAdd.forEach((num) => (result += parseInt(num)));
      Print(
        `Math Command:\n§9[Add] §e${numListAdd.join(" + ")}§r\n  = §c${result}`
      );
      break;

    case "multiply":
      let numListMultiply = equation.split(" ");
      numListMultiply.forEach((num) => (result += parseInt(num)));
      Print(
        `Math Command:\n§9[Multiply] §e${numListMultiply.join(
          " * "
        )}§r\n  = §c${result}`
      );
      break;

    default:
      Print(`There is no subcommand ${subcommand} on math command`);
  }
}
