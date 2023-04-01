import { world } from "@minecraft/server";
import GetScore from "../../lib/GetScore";
import Print from "../../lib/Print";

const EVENT = world.events;

/**
 * Convert tick number to real time format
 *
 * @param {Number} ticks
 * Tick number
 */
function tickToTimeFormat(ticks) {
  const hour = Math.floor(ticks / 72000);
  const min = Math.floor((ticks - hour * 72000) / 1200);
  const sec = Math.floor((ticks - (hour * 72000 + min * 1200)) / 20);
  const ms = Math.floor((ticks - (hour * 72000 + min * 1200 + sec * 20)) * 5);

  return `${String(hour).padStart(2, "0")}:${String(min).padStart(
    2,
    "0"
  )}:${String(sec).padStart(2, "0")}.${String(ms).padStart(2, "0")}`;
}

EVENT.blockBreak.subscribe((eventBlockBreak) => {
  if (GetScore("blockBreak", "gt_events") == 0) return;
  const {
    block: { id: afterID },
    brokenBlockPermutation: {
      type: { id: beforeID },
    },
    dimension: { id: dimensionID },
    player: { name },
  } = eventBlockBreak;
  Print(
    `[LOG][EVENT]-(BlockBreak)\n  Block (Before): ${beforeID}\n  Block (After): ${afterID}\n  Dimension: ${dimensionID}\n  Player: ${name}`
  );
});

EVENT.blockExplode.subscribe((eventBlockExplode) => {
  if (GetScore("blockExplode", "gt_events") == 0) return;
  const {
    block: { id: blockID },
    dimension: { id: dimensionID },
    source: { id: sourceID, nameTag },
  } = eventBlockExplode;
  Print(
    `[LOG][EVENT]-(BlockExplode)\n  Block: ${blockID}\n  Dimension: ${dimensionID}\n  Source: ${sourceID} ~ ${nameTag}`
  );
});

EVENT.blockPlace.subscribe((eventBlockPlace) => {
  if (GetScore("blockPlace", "gt_events") == 0) return;
  const {
    block: { id: blockID },
    dimension: { id: dimensionID },
    player: { name },
  } = eventBlockPlace;
  Print(
    `[LOG][EVENT]-(BlockPlace)\n  Block: ${blockID}\n  Dimension: ${dimensionID}\n  Player: ${name}`
  );
});

EVENT.buttonPush.subscribe((eventButtonPush) => {
  if (GetScore("buttonPush", "gt_events") == 0) return;
  const {
    block: { id: blockID },
    dimension: { id: dimensionID },
    source: { id: sourceID, nameTag },
  } = eventButtonPush;
  Print(
    `[LOG][EVENT]-(ButtonPush)\n  Block: ${blockID}\n  Dimension: ${dimensionID}\n  Source: ${sourceID} ~ ${nameTag}`
  );
});

EVENT.beforeChat.subscribe((eventChat) => {
  if (GetScore("chat", "gt_events") == 0) return;
  const {
    cancel,
    message,
    sendToTargets,
    sender: { name },
    targets: rawTargets,
  } = eventChat;
  const targets = rawTargets.map((player) => player.name);
  Print(
    `[LOG][EVENT]-(Chat)\n  Message: ${message}\n  SendToTargets: ${sendToTargets}\n  Sender: ${name}\n  Targets: ${JSON.stringify(
      targets
    )}`
  );
});

EVENT.beforeDataDrivenEntityTriggerEvent.subscribe((eventEntityEvent) => {
  if (GetScore("dataDrivenEntityTriggerEvent", "gt_events") == 0) return;
  const {
    cancel,
    entity: { id: entityID, nameTag },
    id: eventID,
    modifiers,
  } = eventEntityEvent;
  Print(
    `[LOG][EVENT]-(DataDrivenEntityTriggerEvent)\n  Entity: ${entityID} ~ ${nameTag}\n  Event: ${eventID}\n  Modifiers: [...Coming Soon]`
  );
});

EVENT.effectAdd.subscribe((eventEffectAdd) => {
  if (GetScore("effectAdd", "gt_events") == 0) return;
  const {
    effect: { amplifier, displayName, duration },
    effectState,
    entity: { id: entityID, nameTag },
  } = eventEffectAdd;
  Print(
    `[LOG][EVENT]-(EffectAdd)\n  Amplifier: ${amplifier}\n  DisplayName: ${displayName}\n  Duration: ${tickToTimeFormat(
      duration
    )}\n  EffectState: ${effectState}\n  Entity: ${entityID} ~ ${nameTag}`
  );
});

// EVENT.entityCreate.subscribe((eventEntityCreate) => {
//   if (GetScore("entityCreate", "gt_events") == 0) return;
//   const {
//     entity: { id, nameTag },
//   } = eventEntityCreate;
//   Print(`[LOG][EVENT]-(EntityCreate)\n  Entity: ${id} ~ ${nameTag}`);
// });

EVENT.entityHit.subscribe((eventEntityHit) => {
  if (GetScore("entityHit", "gt_events") == 0) return;
  const {
    entity: { id: entityID, nameTag },
    hitBlock,
    hitEntity,
  } = eventEntityHit;
  Print(
    `[LOG][EVENT]-(EntityHit)\n  Entity: ${entityID} ~ ${nameTag}\n  HitBlock: ${
      hitBlock ? hitBlock.id : undefined
    }\n  HitEntity: ${
      hitEntity ? hitEntity.id + " ~ " + hitEntity.nameTag : undefined
    }`
  );
});

EVENT.entityHurt.subscribe((eventEntityHurt) => {
  if (GetScore("entityHurt", "gt_events") == 0) return;
  const {
    cause,
    damage,
    hurtEntity: { id: entHurtID, nameTag: entHurtNameTag },
  } = eventEntityHurt;
  Print(
    `[LOG][EVENT]-(EntityHurt)\n  Cause: ${cause.toString()}\n  Damage: ${damage}\n  DamagingEntity: ${entDamageID} ~ ${entDamageNameTag}\n  HurtEntity: ${entHurtID} ~ ${entHurtNameTag}\n  Projectile: ${projectileID}`
  );
});

EVENT.beforeExplosion.subscribe((eventExplosion) => {
  if (GetScore("explosion", "gt_events") == 0) return;
  const {
    cancel,
    dimension: { id: dimensionID },
    impactedBlocks,
    source: { id: sourceID },
  } = eventExplosion;
  Print(
    `[LOG][EVENT]-(Explosion)\n  Dimension: ${dimensionID}\n  ImpactedBlocks: [...Coming Soon]\n  Source: ${sourceID}`
  );
});

/**
 * NOTE! Missing Event Debugger
 * - itemCompleteCharge
 */

EVENT.beforeItemDefinitionEvent.subscribe((eventItemDefinitionEvent) => {
  if (GetScore("itemDefinitionEvent", "gt_events") == 0) return;
  const {
    cancel,
    eventName,
    item: { id: itemID },
    source: { id: sourceID, nameTag },
  } = eventItemDefinitionEvent;
  Print(
    `[LOG][EVENT]-(ItemDefinitionEvent)\n  EventName: ${eventName}\n  Item: ${itemID}\n  Source: ${sourceID} ~ ${nameTag}`
  );
});

/**
 * NOTE! Missing Event Debugger
 * - itemReleaseCharge
 * - itemStartCharge
 * - itemStartUseOn
 * - itemStopCharge
 * - itemStopUseOn
 */

EVENT.beforeItemUse.subscribe((eventItemUse) => {
  if (GetScore("itemUse", "gt_events") == 0) return;
  const {
    cancel,
    item: { id: itemID },
    source: { id: sourceID, nameTag },
  } = eventItemUse;
  Print(
    `[LOG][EVENT]-(ItemUse)\n  Item: ${itemID}\n  Source: ${sourceID} ~ ${nameTag}`
  );
});

// Unfinished
EVENT.beforeItemUseOn.subscribe((eventItemUseOn) => {
  if (GetScore("itemUseOn", "gt_events") == 0) return;
  const { blockFace } = eventItemUseOn;
});

EVENT.leverActivate.subscribe((eventLeverActivate) => {
  if (GetScore("leverActivate", "gt_events") == 0) return;
  const {
    block: { id: blockID },
    dimension: { id: dimensionID },
    isPowered,
    player: { name },
  } = eventLeverActivate;
  Print(
    `[LOG][EVENT]-(LeverActivate)\n  Block: ${blockID}\n  Dimension: ${dimensionID}\n  IsPowered: ${isPowered}\n  Player: ${name}`
  );
});

EVENT.pistonActivate.subscribe((eventPistonActivate) => {
  if (GetScore("pistonActivate", "gt_events") == 0) return;
  const {
    block: { id: blockID },
    dimension: { id: dimensionID },
    isExpanding,
    piston,
  } = eventPistonActivate;
  Print(
    `[LOG][EVENT]-(PistonActivate)\n  Block: ${blockID}\n  Dimension: ${dimensionID}\n  IsExpanding: ${isExpanding}\n  Piston: {...Coming Soon}`
  );
});

EVENT.playerJoin.subscribe((eventPlayerJoin) => {
  if (GetScore("playerJoin", "gt_events") == 0) return;
  const {
    player: { name },
  } = eventPlayerJoin;
  Print(`[LOG][EVENT]-(PlayerJoin)\n  Player: ${name}`);
});

EVENT.playerLeave.subscribe((eventPlayerLeave) => {
  if (GetScore("playerLeave", "gt_events") == 0) return;
  const { playerName } = eventPlayerLeave;
  Print(`[LOG][EVENT]-(PlayerLeave)\n  Player: ${playerName}`);
});

EVENT.projectileHit.subscribe((eventProjectileHit) => {
  if (GetScore("projectileHit", "gt_events") == 0) return;
  const {
    dimension: { id: dimensionID },
    hitVector: { x: xVec, y: yVec, z: zVec },
    location: { x: xLoc, y: yLoc, z: zLoc },
    projectile: { id: projectileID },
    source: { id: sourceID, nameTag },
    blockHit,
    entityHit,
  } = eventProjectileHit;
  Print(
    `[LOG][EVENT]-(ProjectileHit)\n  Dimension: ${dimensionID}\n  HitVector: ${xVec} / ${yVec} / ${zVec}\n  Location: ${xLoc} / ${yLoc} / ${zLoc}\n  Projectile: ${projectileID}\n  Source: ${sourceID} ~ ${nameTag}\n  BlockHit: ${
      blockHit ? blockHit.block.id : undefined
    }\n  EntityHit: ${
      entityHit
        ? entityHit.entity.id + " ~ " + entityHit.entity.nameTag
        : undefined
    }`
  );
});

/**
 * NOTE! Intended Missing Event Debugger
 * - "tick" (Deprecated)
 */

EVENT.weatherChange.subscribe((eventWeatherChange) => {
  if (GetScore("weatherChange", "gt_events") == 0) return;
  const {
    dimension: { id: dimensionID },
    lightning,
    raining,
  } = eventWeatherChange;
  Print(
    `[LOG][EVENT]-(WeatherChange)\n  Dimension: ${dimensionID}\n  Lightning: ${lightning}\n  Raining: ${raining}`
  );
});

/**
 * NOTE! Intended Missing Event Debugger
 * - "worldInitialize"
 */
