# Gametest Events

!!! faq "Minecraft Version"

    Updated on Minecraft 1.19.10

Gametest has so many event that can be used. Some useful one is `chat`, `itemUse`, etc.

```js title="[Script] Event Handle"
import { world } from "@minecraft/server";

world.events.*.subscribe(eventData => {
    // Code
})
```

Some event has another `before` event handler. They have the same function with `.cancel` on `before` event handler.
```js
world.events.before*.subscribe(eventBeforeData => {
    // This will cancel the action and non-before event will not running
    eventBeforeData.cancel = true;

    // Code
})
```

# Chat Event
Fires when player sent the message on chat.
```js
// Equivalent to "beforeChat" event with ".cancel"
world.events.chat.subscribe((chatEvent) => {
    // Code
})
```

Event component:

- `.cancel: bool = false`: Cancel the message to sent
- `.message -> str`: The message of what player sent
- `.sender -> Player`: Who sent the message
- `.sendToTargets -> bool`: Are the message broadcast to all player?
- `.target -> Player[]`: List of player who got the message

# Explosion Event

Fires when entity explode

- Minecraft Version: Unknown
- Equivalent: Event `explosion` (Without `.cancel`)

Event component:

- `.cancel: bool = false`: Cancel the explosion
- `.dimension -> Dimension`: The dimension of where the explosion was
- `.entity -> Entity`: The entity who explode

# Item Use Event

Fires when entity use the item (Can be use to detect "Right Click")

- Minecraft Version: Unknown
- Equivalent: Event `itemUse` (Without `.cancel`)

Event component:

- `.cancel: bool = false`: Cancel the item get used
- `.item -> ItemStack`: Item that entity use
- `.entity -> Entity`: Entity who use the item

# Item Use On Event

Fires when entity use the item on block (Nearly same with `beforeItemUse` event)

- Minecraft Version: Unknown
- Equivalent: Event `itemUseOn` (Without `.cancel`)

Event component:

- `.cancel: bool = false`: Cancel the item get used on block
- `.blockFace -> Direction`: ???
- `.blockLocation -> BlockLocation`: The location of the block
- `.faceLocationX -> float`: Entity's X rotation
- `.faceLocationY -> float`: Entity's Y rotation
- `.item -> ItemStack`: Item that entity use
- `.entity -> Entity`: Entity who use the item

# Piston Activate

Fires when piston was turned on/off

- Minecraft Version: Unknown
- Equivalent: Event `pistonActivate` (Without `.cancel`)

Event component:

- `.cancel: bool = false`: Cancel the piston turned on/off
- `.block -> Block`: What block get pushed/pulled
- `.dimension`

# Entity Hurt Event

Fires when entity get hurt by entity

Added on:

- Beta 1.18.30.20 / Preview 1.18.30.21
- Stable 1.18.30

Event Component:

- `.cause -> str`: The type of damage received
- `.damage -> int`: The number of damage received (In HP)
- `.damagingEntity -> Entity`: Entity that gives damage
- `.hurtEntity -> Entity`: Entity that receives damage
- `.projectile -> Entity`: The projectile used to gives damage

