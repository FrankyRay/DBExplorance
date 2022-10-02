import { world } from "mojang-minecraft";
import Print from "../../lib/Print";
// Testing all events on "mojang-minecraft" module

// Variable "Event" for fast typing
const Event = world.events;

function tickToTimeFormat(ticks) {
  let time = ticks / 20;
  let minute = Math.floor(time / 60);
  let second = time % 60;

  return `${minute}:${second}`;
}

/* Event List */

function eventChat() {
  Event.beforeChat.subscribe((chatEvent) => {
    let message = chatEvent.message;
    let player = chatEvent.sender.name;
    let send = chatEvent.sendToTargets;
    let target = chatEvent.targets;
    Print(
      `[Event][Chat]\nMessage: ${message}\nsender: ${player}\nsendToTargets: ${send}\ntargets: ${target}}`
    );
  });
}

function eventDataDrivenEntity() {
  Event.beforeDataDrivenEntityTriggerEvent.subscribe((DDETEvent) => {
    let entity = DDETEvent.entity.id;
    let eventID = DDETEvent.id;
    let modifier = DDETEvent.modifiers;
    Print(
      `[Event][Data Driven Entity Trigger]\nEntity: ${entity}\nEvent ID: ${eventID}\nModifier: ${modifier}`
    );
  });
}

function eventExplosion() {
  Event.beforeExplosion.subscribe((explodeEvent) => {
    let dimension = explodeEvent.dimension.id;
    let entity = explodeEvent.source.id;
    Print(
      `[Event][Explosion]\nDimension: ${dimension}\nEntity Source: ${entity}`
    );
  });
}

function eventItemUse() {
  Event.beforeItemUse.subscribe((itemEvent) => {
    let item = itemEvent.item.id;
    let entity = itemEvent.source.id;
    Print(`[Event][Item Use]\nItem: ${item}\nEntity: ${entity}`);
  });
}

function eventItemUseOn() {
  Event.beforeItemUseOn.subscribe((itemOnEvent) => {
    let blockFace = itemOnEvent.blockFace;
    let { x, y, z } = itemOnEvent.blockLocation;
    let faceX = itemOnEvent.faceLocationX;
    let faceY = itemOnEvent.faceLocationY;
    let item = itemOnEvent.item.id;
    let entity = itemOnEvent.source.id;
    Print(
      `[Event][Item Use On]\nBlock Face: ${blockFace}\nBlock Location: ${x}, ${y}, ${z}\nFace Location: ${faceX}, ${faceY}\nItem: ${item}\nEntity: ${entity}`
    );
  });
}

function eventPistonActivate() {
  Event.beforePistonActivate.subscribe((pistonEvent) => {
    let block = pistonEvent.block.id;
    let dimension = pistonEvent.dimension.id;
    let expanding = pistonEvent.isExpanding;
    Print(
      `[Event][Piston Activate]\nBlock: ${block}\nDimension: ${dimension}\nIs Expanding: ${expanding}`
    );
  });
}

/**
 * 1.18.10.21?
 */
function eventBlockBreak() {
  Event.blockBreak.subscribe((breakEvent) => {
    let block = breakEvent.brokenBlockPermutation.type.id;
    let blockAfter = breakEvent.block.id;
    let dimension = breakEvent.dimension.id;
    let player = breakEvent.player.name;
    Print(
      `[Event][Block Break]\nBlock: ${block}\nBlock After: ${blockAfter}\nDimension: ${dimension}\nPlayer: ${player}`
    );
  });
}

/**
 * 1.18.10.21?
 */
function eventBlockExplode() {
  Event.blockExplode.subscribe((blockExplodeEvent) => {
    let block = blockExplodeEvent.block.id;
    let dimension = blockExplodeEvent.dimension.id;
    let entity = blockExplodeEvent.source.id;
    Print(
      `[Event][Block Explode]\nBlock: ${block}\nDimension: ${dimension}\nEntity: ${entity}`
    );
  });
}

function eventBlockPlace() {
  Event.blockPlace.subscribe((placeEvent) => {
    let block = placeEvent.block.id;
    let dimension = placeEvent.dimension.id;
    let player = placeEvent.player.name;
    Print(
      `[Event][Block Place]\nBlock: ${block}\nDimension: ${dimension}\nPlayer: ${player}`
    );
  });
}

function eventEffectAdd() {
  Event.effectAdd.subscribe((effectEvent) => {
    let effect = effectEvent.effect.displayName;
    let effectAmp = effectEvent.effect.amplifier;
    let duration = effectEvent.effect.duration;
    let effectState = effectEvent.effectState;
    let entity = effectEvent.entity.id;
    Print(
      `[Event][Effect Add]\nEffect: ${effect}\nEffect Amplifier: ${effectAmp}\nDuration: ${duration} Tick(s) (${tickToTimeFormat(
        duration
      )})\nEffect State: ${effectState}\nEntity: ${entity}`
    );
  });
}

function eventEntityCreate() {
  Event.entityCreate.subscribe((createEvent) => {
    let entity = createEvent.entity.id;
    Print(`[Event][Entity Create]\nEntity: ${entity}`);
  });
}

function eventEntityHit() {
  Event.entityHit.subscribe((hitEvent) => {
    let entity = hitEvent.entity.id;
    let hitBlock = hitEvent.hitBlock?.id;
    let hitEntity = hitEvent.hitEntity?.id;
    Print(
      `[Event][Entity Hit]\nEntity Source: ${entity}\nBlock: ${hitBlock}\nEntity: ${hitEntity}`
    );
  });
}

function eventEntityHurt() {
  Event.entityHurt.subscribe((hurtEvent) => {
    let cause = hurtEvent.cause;
    let damage = hurtEvent.damage;
    let source = hurtEvent.damagingEntity?.id;
    let target = hurtEvent.hurtEntity.id;
    let projectile = hurtEvent.projectile?.id;
    Print(
      `[Event][Entity Hurt]\nDamage Cause: ${cause}\nDamage: ${damage}\nSource: ${source}\nTarget: ${target}\nProjectile: ${projectile}`
    );
  });
}

function eventItemCompleteCharge() {
  Event.itemCompleteCharge.subscribe((completeChargeEvent) => {
    let item = completeChargeEvent.itemStack.id;
    let entity = completeChargeEvent.source.id;
    let duration = completeChargeEvent.useDuration;
    Print(
      `[Event][Item Complete Charge]\nItem: ${item}\nEntity: ${entity}\nDuration: ${duration}`
    );
  });
}

function eventItemReleaseCharge() {
  Event.itemReleaseCharge.subscribe((releaseChargeEvent) => {
    let item = releaseChargeEvent.itemStack.id;
    let entity = releaseChargeEvent.source.id;
    let duration = releaseChargeEvent.useDuration;
    Print(
      `[Event][Item Release Charge]\nItem: ${item}\nEntity: ${entity}\nDuration: ${duration}`
    );
  });
}

function eventItemStartCharge() {
  Event.itemStartCharge.subscribe((startChargeEvent) => {
    let item = startChargeEvent.itemStack.id;
    let entity = startChargeEvent.source.id;
    let duration = startChargeEvent.useDuration;
    Print(
      `[Event][Item Start Charge]\nItem: ${item}\nEntity: ${entity}\nDuration: ${duration}`
    );
  });
}

function eventItemStartUseOn() {
  Event.itemStartUseOn.subscribe((startUseOnEvent) => {
    let blockFace = startUseOnEvent.blockFace;
    let { x: p, y: q, z: r } = startUseOnEvent.buildBlockLocation;
    let { x: a, y: b, z: c } = startUseOnEvent.blockLocation;
    let item = startUseOnEvent.item.id;
    let entity = startUseOnEvent.source.id;
    Print(
      `[Event][Item Start Use On]\nBlock Face: ${blockFace}\nBlock Location: ${a} ${b} ${c}\nBuild Location: ${p} ${q} ${r}\nItem: ${item}\nEntity: ${entity}`
    );
  });
}

function eventItemStopCharge() {
  Event.itemStopCharge.subscribe((stopChargeEvent) => {
    let item = stopChargeEvent.itemStack.id;
    let entity = stopChargeEvent.source.id;
    let duration = stopChargeEvent.useDuration;
    Print(
      `[Event][Item Stop Charge]\nItem: ${item}\nEntity: ${entity}\nDuration: ${duration}`
    );
  });
}

function eventItemStopUseOn() {
  Event.itemStopUseOn.subscribe((stopUseOnEvent) => {
    let { x, y, z } = stopUseOnEvent.blockLocation;
    let item = stopUseOnEvent.item.id;
    let entity = stopUseOnEvent.source.id;
    Print(
      `[Event][Item Stop Use On]\nBlock Location: ${x} ${y} ${z}\nItem: ${item}\nEntity: ${entity}`
    );
  });
}

function eventLeverActivate() {
  Event.leverActivate.subscribe((leverEvent) => {
    let block = leverEvent.block.id;
    let dimension = leverEvent.dimension.id;
    let power = leverEvent.isPowered;
    let player = leverEvent.player.name;
    console.log(
      `[Event][Lever Activate]\nBlock: ${block}\nDimension: ${dimension}\nPower: ${power}\nPlayer: ${player}`
    );
  });
}

// Player Join Event
// Player Leave Event

function eventProjectileHit() {
  Event.projectileHit.subscribe((projectileEvent) => {
    let dimension = projectileEvent.dimension.id;
    let vector = projectileEvent.hitVector;
    let { x, y, z } = projectileEvent.location;
    let projectile = projectileEvent.projectile.id;
    let source = projectileEvent.source.id;
    if (projectileEvent.blockHit != undefined) {
      let {
        block: { id },
        face,
        faceLocationX,
        faceLocationY,
      } = projectileEvent.blockHit;
      Print(
        `[Event][Projectile Hit]\nBlock: \n- ID: ${id}\n- Face: ${face}\n- Face Location: ${faceLocationX} ${faceLocationY}\nDimension: ${dimension}\nVector: ${vector}\nLocation: ${x} ${y} ${z}\nProjectile: ${projectile}\nSource: ${source}`
      );
    } else if (projectileEvent.entityHit != undefined) {
      let entity = projectileEvent.entityHit.entity.id;
      Print(
        `[Event][Projectile Hit]\nTarget: ${entity}\nDimension: ${dimension}\nVector: ${vector}\nLocation: ${x} ${y} ${z}\nProjectile: ${projectile}\nSource: ${source}`
      );
    }
  });
}

// Tick Event

function eventWeatherChange() {
  Event.weatherChange.subscribe((weatherEvent) => {
    let dimension = weatherEvent.dimension;
    let lightning = weatherEvent.lightning;
    let raining = weatherEvent.raining;
    Print(
      `[Event][Weather Change]\nDimension: ${dimension}\nLightning: ${lightning}\nRaining: ${raining}`
    );
  });
}

// World Initialize Event

/* Event Test */

// -+- Work -+-
// eventBlockBreak();
// eventBlockPlace();
// eventChat();
// eventEffectAdd();
// eventEntityCreate();
// eventEntityHit();
// eventExplosion();
eventItemUse();
// eventItemUseOn();
// eventPistonActivate();
// eventWeatherChange();
// eventBlockExplode();
// eventDataDrivenEntity();
// eventEntityHurt();
// eventItemCompleteCharge();
// eventItemReleaseCharge();
// eventItemStartCharge();
// eventItemStartUseOn();
// eventItemStopCharge();
// eventItemStopUseOn();
// eventLeverActivate();
// eventProjectileHit();

// -+- Test -+-

// -+- Custom -+-
