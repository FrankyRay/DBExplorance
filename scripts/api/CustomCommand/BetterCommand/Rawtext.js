// @ts-check
import { world } from "mojang-minecraft";

export default function Rawtext(player, args) {
  let [optsRawtext, text] = args;
  let regexRawtext = /(\<@\w(?:\[.*?\])?(?:\|\w+)?\>)/g;
  let messagePiece = text.split(regexRawtext);
  // console.warn(JSON.stringify(messagePiece));

  let rawtext = [];
  for (let msg in messagePiece) {
    if (!messagePiece[msg].startsWith("<")) {
      rawtext.push({ text: messagePiece[msg] });
    } else if (messagePiece[msg].indexOf("|") < 0) {
      rawtext.push({ selector: messagePiece[msg].replace(/[><]/g, "") });
    } else {
      let [target, obj] = messagePiece[msg].replace(/[><]/g, "").split("|");
      rawtext.push({ score: { name: target, objective: obj } });
    }
  }

  let objRawtext = `{"rawtext": ${JSON.stringify(rawtext)}}`;
  if (optsRawtext == "tell") {
    player.runCommand(`tellraw @a ${objRawtext}`);
  } else {
    player.runCommand(`titleraw @a ${optsRawtext} ${objRawtext}`);
  }
}
