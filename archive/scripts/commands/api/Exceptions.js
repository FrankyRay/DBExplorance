import { world, Player, MessageSourceType } from "@minecraft/server";

/**
 * Throw error message to player (private)/world (public)
 * and end the command
 *
 * @param {Player|MessageSourceType} player
 * Player class or MessageSourceType enum
 *
 * @param {string} message
 * Error message
 *
 * @param {string} langKey
 * Lang key for multi-language error message (on .lang)
 *
 * @param {string[]} langValue
 * Lang value use for error message
 */
export default function CommandException(
  player,
  message,
  langKey = "",
  langValue = []
) {
  let rawtext;
  if (langKey) {
    rawtext = {
      rawtext: [
        {
          translate: langKey,
          with: {
            rawtext:
              langValue?.map((val) => {
                return {
                  text: "" + val,
                };
              }) ?? [],
          },
        },
      ],
    };
  }

  if (player instanceof Player && rawtext) {
    player.runCommandAsync(`tellraw @s ${JSON.stringify(rawtext)}`);
  } else if (player instanceof MessageSourceType && rawtext) {
    rawtext.rawtext.splice(0, 0, `[/scriptevent][${player}]: `);
    world
      .getDimension("overworld")
      .runCommandAsync(`tellraw @s ${JSON.stringify(rawtext)}`);
  }

  throw message;
}
