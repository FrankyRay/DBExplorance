import { world } from "@minecraft/server";
import { MessageFormData } from "@minecraft/server-ui";

world.events.beforeItemUse.subscribe((event) => {
  const { item, source } = event;
  const EntityRay = {
    maxDistance: 10,
  };

  const entity = source.getEntitiesFromViewVector(EntityRay)[0];
  if (!entity) return;

  if (
    item?.id == "minecraft:book" &&
    item?.nameTag == "§rEntityComponentCheck"
  ) {
    EntityComponentUI(source, entity);
    event.cancel = true;
  }
});

/**
 * Show entity component XMLList
 * @param {import("@minecraft/server").Player} player The player class for showing UI
 * @param {import("@minecraft/server").Entity} entity The entity for taking the component
 */
function EntityComponentUI(player, entity) {
  const componentForm = new MessageFormData()
    .title(`Entity Components [ID: ${entity.id.replace("minecraft:", "")}]`)
    .button1("Ok")
    .button2("Cancel");

  let componentMessage = `§gGeneral§r
Dimension = ${entity.dimension.id}
Head Location:
  X = ${entity.headLocation.x}
  Y = ${entity.headLocation.y}
  Z = ${entity.headLocation.z}
ID = ${entity.id}
Is Sneaking = ${entity.isSneaking}
Location:
  X = ${entity.location.x}
  Y = ${entity.location.y}
  Z = ${entity.location.z}
Name Tag = ${entity.nameTag ? entity.nameTag : "-"}
Rotation:
  X = ${entity.rotation.x}
  Y = ${entity.rotation.y}
Velocity:
  X = ${entity.velocity.x}
  Y = ${entity.velocity.y}
  Z = ${entity.velocity.z}
View Vector:
  X = ${entity.viewVector.x}
  Y = ${entity.viewVector.y}
  Z = ${entity.viewVector.z}
`;

  let comps = entity.getComponents().map((x) => x.id);
  for (let comp of comps.sort()) {
    let entComp = entity.getComponent(comp);
    switch (comp) {
      case "minecraft:addrider":
        componentMessage += `\n§gAddRider§r
Entity Type = ${entComp.entityType}
Spawn Event = ${entComp.spawnEvent}
`;
        break;

      case "minecraft:ageable":
        componentMessage += `\n§gAgeable§r
Drop Items = ${JSON.stringify(entComp.dropItems)}
Duration = ${entComp.duration}
Feed Item = [TBA]
Grow Up = ${entComp.trigger?.eventName ?? "-"}
`;
        break;

      case "minecraft:breathable":
        componentMessage += `\n§gBreathable§r
Breathe Blocks = [TBA]
Breathes Air = ${entComp.breathesAir}
Breathes Lava = ${entComp.breathesLava}
Breathes Solids = ${entComp.breathesSolids}
Breathes Water = ${entComp.breathesWater}
Generates Bubbles = ${entComp.generatesBubbles}
Inhale Time = ${entComp.inhaleTime}
Non-Breathe Blocks = [TBA]
Suffocate Time = ${entComp.suffocateTime}
Total Supply = ${entComp.totalSupply}
`;
        break;

      case "minecraft:can_climb":
        componentMessage += `\n§gCan Climb§r: TRUE\n`;
        break;

      case "minecraft:can_fly":
        componentMessage += `\n§gCan Fly§r: TRUE\n`;
        break;

      case "minecraft:can_power_jump":
        componentMessage += `\n§gCan Power Jump§r: TRUE\n`;
        break;

      case "minecraft:color":
        componentMessage += `\n§gColor§r
Value = ${entComp.value}
`;
        break;

      case "minecraft:fire_immune":
        componentMessage += `\n§gFire Immune§r: TRUE\n`;
        break;

      case "minecraft:floats_in_liquid":
        componentMessage += `\n§gFloats In Liquid§r: TRUE\n`;
        break;

      case "minecraft:flying_speed":
        componentMessage += `\n§gFlying Speed§r
Value = ${entComp.value}
`;
        break;

      case "minecraft:friction_modifier":
        componentMessage += `\n§gFriction Modifier§r
Value = ${entComp.value}
`;
        break;

      case "minecrafy:ground_offset":
        componentMessage += `\n§gGround Offset§r
Value = ${entComp.value}
`;
        break;

      case "minecraft:healable":
        componentMessage += `\n§gHealable§r
Filters = [TBA]
Force Use = ${entComp.forceUse}
Items = [TBA]
`;
        break;

      case "minecraft:health":
        componentMessage += `\n§gHealth§r
Current = ${entComp.current}
Value = ${entComp.value}
`;
        break;

      case "minecraft:inventory":
        componentMessage += `\n§gInventory§r
Additional Slots Per Strength = ${entComp.additionalSlotsPerStrength}
Can Be Siphoned From = ${entComp.canBeSiphonedFrom}
Container:
  Empty Slots Count = ${entComp.container.emptySlotsCount}
  Size = ${entComp.container.size}
Container Type = ${entComp.containerType}
Inventory Size = ${entComp.inventorySize}
Private = ${entComp.private}
Restrict To Owner = ${entComp.restrictToOwner}
`;
        break;

      case "minecraft:is_baby":
        componentMessage += `\n§gIs Baby§r: TRUE\n`;
        break;

      case "minecraft:is_charged":
        componentMessage += `\n§gIs Charged§r: TRUE\n`;
        break;

      case "minecraft:is_chested":
        componentMessage += `\n§gIs Chested§r: TRUE\n`;
        break;

      case "minecraft:is_dyeable":
        componentMessage += `\n§gIs Dyeable§r: TRUE\n`;
        break;

      case "minecraft:is_hidden_when_invisible":
        componentMessage += `\n§gIs Hidden When Invisible§r: TRUE\n`;
        break;

      case "minecraft:is_ignited":
        componentMessage += `\n§gIs Ignited§r: TRUE\n`;
        break;

      case "minecraft:is_illager_captain":
        componentMessage += `\n§gIs Illager Captain§r: TRUE\n`;
        break;

      case "minecraft:is_saddled":
        componentMessage += `\n§gIs Saddled§r: TRUE\n`;
        break;

      case "minecraft:is_shaking":
        componentMessage += `\n§gIs Shaking§r: TRUE\n`;
        break;

      case "minecraft:is_sheared":
        componentMessage += `\n§gIs Sheared§r: TRUE\n`;
        break;

      case "minecraft:is_stackable":
        componentMessage += `\n§gIs Stackable§r: TRUE\n`;
        break;

      case "minecraft:is_stunned":
        componentMessage += `\n§gIs Stunned§r: TRUE\n`;
        break;

      case "minecraft:is_tamed":
        componentMessage += `\n§gIs Tamed§r: TRUE\n`;
        break;

      case "minecraft:item":
        componentMessage += `\n§gItem§r
Item Stack:
  Amount = ${entComp.itemStack.amount}
  Data = ${entComp.itemStack.data}
  ID = ${entComp.itemStack.id}
  Name Tag = ${entComp.itemStack.nameTag ?? "-"}
`;
        break;

      case "minecraft:lava_movement":
        componentMessage += `\n§gLava Movement§r
Current = ${entComp.current}
Value = ${entComp.value}
`;
        break;

      case "minecraft:leashable":
        componentMessage += `\n§gLeashable§r
Soft Distance = ${entComp.softDistance}
`;
        break;

      case "minecraft:mark_variant":
        componentMessage += `\n§gMark Variant§r
Value = ${entComp.value}
`;
        break;

      case "minecraft:mount_taming":
        componentMessage += `\n§gMount Taming§r: TRUE\n`;
        break;

      case "minecraft:movement":
        componentMessage += `\n§gMovement§r
Current = ${entComp.current}
Value = ${entComp.value}
`;
        break;

      case "minecraft:movement.glide":
        componentMessage += `\n§gMovement.glide§r
Max Turn = ${entComp.maxTurn}
Speed When Turning = ${entComp.speedWhenTurning}
Start Speed = ${entComp.startSpeed}
`;
        break;

      case "minecraft:movement.sway":
        componentMessage += `\n§gMovement.slay§r
Max Turn = ${entComp.maxTurn}
Sway Amplitude = ${entComp.swayAmplitude}
Sway Frequency = ${entComp.swayFrequency}
`;
        break;

      case "minecraft:movement.amphibious":
      case "minecraft:movement.basic":
      case "minecraft:movement.fly":
      case "minecraft:movement.generic":
      case "minecraft:movement.hover":
      case "minecraft:movement.jump":
      case "minecraft:movement.skip":
        componentMessage += `\n§gMovement.${comp.replace(
          "minecraft:movement.",
          ""
        )}§r
Max Turn = ${entComp.maxTurn}
`;
        break;

      case "minecraft:navigation.climb":
      case "minecraft:navigation.float":
      case "minecraft:navigation.fly":
      case "minecraft:navigation.generic":
      case "minecraft:navigation.hover":
      case "minecraft:navigation.walk":
        componentMessage += `\n§gNavigation.${comp.replace(
          "minecraft:navigation.",
          ""
        )}§r
Avoid Damage Blocks = ${entComp.avoidDamageBlocks}
Avoid Portals = ${entComp.avoidPortals}
Avoid Sun = ${entComp.avoidSun}
Avoid Water = ${entComp.avoidWater}
Can Breach = ${entComp.canBreach}
Can Break Doors = ${entComp.canBreakDoors}
Can Float = ${entComp.canFloat}
Can Jump = ${entComp.canJump}
Can Open Doors = ${entComp.canOpenDoors}
Can Open Iron Doors = ${entComp.canOpenIronDoors}
Can Pass Doors = ${entComp.canPassDoors}
Can Path From Air = ${entComp.canPathFromAir}
Can Path Over Lava = ${entComp.canPathOverLava}
Can Path Over Water = ${entComp.canPathOverWater}
Can Sink = ${entComp.canSink}
Can Swim = ${entComp.canSwim}
Can Walk = ${entComp.canWalk}
Can Walk In Lava = ${entComp.canWalkInLava}
Is Amphibious = ${entComp.isAmphibious}
`;
        break;

      case "minecraft:push_through":
        componentMessage += `\n§gPush Through§r
Value = ${entComp.value}
`;
        break;

      case "minecraft:rideable":
        componentMessage += `\n§gRideable§r
Controlling Seat = ${entComp.controllingSeat}
Crouching Skip Interact = ${entComp.crouchingSkipInteract}
Family Types = ${JSON.stringify(entComp.familyTypes)}
Interact Text = ${entComp.interactText}
Pull In Entities = ${entComp.pullInEntities}
Rider Can Interact = ${entComp.riderCanInteract}
Seat Count = ${entComp.seatCount}
Seats = [TBA]
`;
        break;

      case "minecraft:scale":
        componentMessage += `\n§gScale§r
Value = ${entComp.value}
`;
        break;

      case "minecraft:skin_id":
        componentMessage += `\n§gSkin ID§r
Value = ${entComp.value}
`;
        break;

      case "minecraft:strength":
        componentMessage += `\n§gStrength§r
Max = ${entComp.max}
Value = ${entComp.value}
`;
        break;

      case "minecraft:tameable":
        componentMessage += `\n§gTameable§r
Probability = ${entComp.probability}
Tame Event = ${entComp.tameEvent.eventName}
Tame Items = ${JSON.stringify(entComp.tameItems)}
`;
        break;

      case "minecraft:underwater_movement":
        componentMessage += `\n§gUnderwater Movement§r
Current = ${entComp.current}
Value = ${entComp.value}
`;
        break;

      case "minecraft:variant":
        componentMessage += `\n§gVariant§r
Value = ${entComp.value}
`;
        break;

      case "minecraft:wants_jockey":
        componentMessage += `\n§gWants Jockey§r: TRUE\n`;
        break;

      default:
        componentMessage += `\n§g${comp} [TBA]§r\n`;
    }
  }

  componentForm
    .body(componentMessage)
    .show(player)
    .then((response) => {
      if (response.isCanceled || response.canceled) return;
    });
}
