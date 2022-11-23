import { world } from "@minecraft/server";

/**
 * Delayed the code in ticks
 * @param {Function} func Run specific code when delay is done
 * @param {number} tick How long the delay
 */
export default function setTickTimeout(func, tick) {
  let initTick = -1;
  let tickEvent = world.events.tick.subscribe((tickData) => {
    if (initTick === -1) initTick = tickData.currentTick;

    if (tickData.currentTick - initTick === tick) {
      try {
        func();
      } catch (err) {
        console.warn(err);
      } finally {
        world.events.tick.unsubscribe(tickEvent);
      }
    }
  });
}
