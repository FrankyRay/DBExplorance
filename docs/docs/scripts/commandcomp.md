# Command Component

!!! faq "Minecraft Version"

    Updated on Minecraft 1.19.10

Command on Gametest return object containing some command data. 

``` js title="[Script] Example code"
let command = "give @a apple 1 0"
let data = player.runCommand(command)
```

Every command will return `statusCode` and `statusMessage` with additional property every commands

``` json title="Example command property"
{
    // Status code indicating if the command work or not
    // 0: Success
    // -2147352576: Error
    "statusCode": 0,

    // Status message is the message output from the command
    "statusCode": "<Message/Output from the command>"
}
```

!!! error ""

    Unexecutable command will throw error to the content log containing stringify object of command error property. Use try catch to take the data.

    This document will show you which command will throw error with [Error] code

## Ability

??? note

    Command `/ability` accessible with `Education Edition` toggle enabled

Set the target's ability
```json title="Command: /ability @s mayfly true"
{
    "player": ["FrankyRayMS"],
    "statusCode": 0,
    "statusMessage": "Ability has been updated",
    "value": true // The value of the ability
}
```

Check all player's ability
```json title="Command: /ability @s"
{
    "details": "{\n  \"mayfly\": true,\n  \"mute\": false,\n  \"worldbuilder\": false\n}\n",
    "displayString": "mayfly, mute, worldbuilder",
    "statusCode": 0,
    "statusMessage": "mayfly, mute, worldbuilder"
}
```

Check specific player's ability
```json title="Command: /ability @s mayfly"
{
    "details": "{\n  \"mayfly\": true\n}\n",
    "displayString": "mayfly = true",
    "statusCode": 0,
    "statusMessage": "mayfly = true"
}
```

## Alwaysday

!!! info ""

    Similar command: `/daylock`

```json title="Command: /alwaysday true"
{
    "statusCode": 0
}
```

## Camerashake

Add camera shake to the player
```json title="Command: /camerashake add @s"
{
    "player": ["FrankyRayMS"],
    "statusCode": 0,
    "statusMessage": "Send a request to the following players for their camera to shake: FrankyRayMS"
}
```

Stop camera shake to the player
```json title="Command: /camerashake add @s"
{
    "player": ["FrankyRayMS"],
    "statusCode": 0,
    "statusMessage": "Stopping the camera shake for the following players: FrankyRayMS"
}
```

## Clear

Clear player's inventory when there's any item
```json title="Command: /clear"
{
    "itemsRemoved": ["64"],
    "player": ["FrankyRayMS"],
    "statusCode": 0,
    "statusMessage": "Cleared the inventory of FrankyRayMS, removing 64 items"
}
```

Clear player's inventory when no item [Error]
```json title="Command: /clear"
{
    "itemsRemoved": ["0"],
    "player": ["FrankyRayMS"],
    "statusCode": -2147352576,
    "statusMessage": "Could not clear the inventory of {player}, no items to remove"
}
```

Check item's amount on the player with `amount` set to `0`
```json title="Command: /clear @s diamond 0 0"
{
    "playerTest": ["FrankyRayMS (64)"],
    "statusCode": 0,
    "statusMessage": "FrankyRayMS has 64 items that match the criteria"
}
```

## Clone

Successfully clone the area
```json title="Command: /clone 0 0 0 0 3 0 0 10 0"
{
    "count": 4,
    "statusCode": 0,
    "statusMessage": "4 block cloned"
}
```

No block cloned [Error]
```json
{
    "statusCode": -2147352576,
    "statusMessage": "No blocks cloned"
}
```

Source and destination area are overlap (without `filtered force`) [Error]
```json title="Command: /clone 0 0 0 0 3 0 0 2 0"
{
    "statusCode": -2147352576,
    "statusMessage": "Source and destination can not overlap"
}
```

Trying accessing block outside world [Error]
```json title="Command: /clone 0 -1 0 0 3 0 0 10 0"
{
    "statusCode": -2147352576,
    "statusMessage": "Cannot access blocks outside of the world"
}
```

!!! cite "[Personal] Test failed"

    Test again for `/clone` error:  
    "Too many blocks in the specific area (%1$d > %2$d)"  
    Max blocks (from Minecraft Wiki): 524288 blocks

## Clearspawnpoint

```json title="Command: /clearspawnpoin"
{
    "player": ["FrankyRayMS"],
    "statusCode": 0,
    "statusMessage": "Removed FrankyRayMS's spawn point"
}
```

## Connect

!!! info ""

    Similar command: `/wsserver`

!!! missing "Gametest Error"

    Gametest didn't support `/connect` due to lowest permission level (required 2, got 1) and restriction

    ```json title="Command: /connect 1"
    {
        "statusCode": -2147352576,
        "statusMessage": "Unknown command: wsserver. Please check that the command exists and that you have permission to use it."
    }
    ```

## Damage

Successfully damage the target
```json title="Command: /damage @s 1 fall"
{
    "hurtActors": ["FrankyRayMS"],
    "statusCode": 0,
    "statusMessage": "Applied damage to FrankyRayMS"
}
```

Cannot damage the target [Error]
```json title="Command: /damage @s 1 fall [Creative]"
{
    "statusCode": 0,
    "statusMessage": "Could not apply damage to FrankyRayMS",
    "unhurtActors": ["FrankyRayMS"]
}
```

Too many damage sources [Error]
```json title="Command: /damage @s 1 entity_attack entity @e"
{
    "statusCode": -214735276,
    "statusMessage": "There can only be one source entity. Please adjust your selector to limit selection to one entity."
}
```

!!! info

    Command still run perfectly even there's unhurtable target/entity. The data will returned both `hurtActors` and `unhurtActors`.

    ```json title="Command: /damage @e 1 fall"
    {
        "hurtActors": ["FrankyRayMS"],
        "statusCode": 0,
        "statusMessage": "Applied damage to FrankyRayMS\nCould not apply damage to Armor Stand",
        "unhurtActors": ["Armor Stand"]
    }
    ```

## Daylock

!!! info ""

    Similar command: `/alwaysday`

```json title="Command: /daylock true"
{
    "statusCode": 0
}
```

## Deop

!!! missing "Gametest Error"

    Gametest didn't support `/deop` due to lowest permission level (required 2, got 1)

    ```json title="Command: /deop @s"
    {
        "statusCode": -2147352576,
        "statusMessage": "Unknown command: deop. Please check that the command exists and that you have permission to use it."
    }
    ```

## Dialogue

!!! warning ""

    No documentation yet!

## Difficulty

```json title="Command: /difficulty p"
{
    "difficulty": "PEACEFUL",
    "statusCode": 0,
    "statusMessage": "Set game difficulty to PEACEFUL"
}
```

List of `"difficulty"` value
```yaml
difficulty:
  - PEACEFUL
  - EASY
  - NORMAL
  - HARD
```

## Effect

Successfully give effect to target
```json title="Command: /effect @s saturation"
{
    "amplifier": 0,
    "effect": "saturation",
    "player": ["FrankyRayMS"],
    "seconds": 30,
    "statusCode": 0,
    "statusMessage": "Gave Saturation * 0 to FrankyRayMS for 30 seconds"
}
```

Clears all effect from target
```json title="Command: effect @s clear"
{
    "statusCode": 0,
    "statusMessage": "Took all effect from FrankyRaymS"
}
```

Clears no effect on the target [Error]
```json title="Command: /effect @s clear"
{
    "player": ["FrankyRayMS"],
    "statusCode": -2147352576,
    "statusMessage": "Couldn't take any effects from FrankyRayMS as they do not have any"
}
```

## Enchant

Successfully enchant an item
```json title="Command: /enchant @s sharpness 5"
{
    "playerName": ["FrankyRayMS"],
    "statusCode": 0,
    "statusMessage": "Enchanting succeeded for FrankyRayMS"
}
```

Combining incompatible enchantment [Error]
```json title="Command: /enchant @s smite 5"
{
    "playerNames": ["FrankyRayMS"],
    "statusCode": -2147352576,
    "statusMessage": "Smite can't be combined with Sharpness"
}
```

Too high enchantment's level [Error]
```json title="Command: /enchant @s sharpness 10"
{
    "statusCode": 0,
    "statusMessage": "Sharpness does not support level 10"
}
```

Add enchantment into incompatible item [Error]
```json title="Command: /enchant @s fortune 1"
{
    "playerNames": ["FrankyRayMS"],
    "statusCode": -2147352576,
    "statusMessage": "The selected enchantment can't be added to the target item: Fortune"
}
```

Player didn't hold any item [Error]
```json
{
    "playerNames": ["FrankyRayMS"],
    "statusCode": -2147352576,
    "statusMessage": "The target doesn't hold an item: FrankyRayMS"
}
```

!!! cite "[Personal] Re-check"

    Recheck returned data from `/enchant` (Error only)

## Event

!!! warning ""

    No documentation yet!

## Execute

!!! warning ""

    No documentation yet!

## Fill

Successfully fill the area
```json title="Command: /fill 0 0 0 3 3 3 wool 10"
{
    "blockName": "Purple Wool",
    "fillCount": 16,
    "statusCode": 0,
    "statusMessage": "16 blocks filled"
}
```

Fill 0 blocks [Error]
```json title="Command: /fill 0 0 0 0 0 0 wool 10 replace wool 0"
{
    "blockName": "Purple Wool",
    "fillCount": 0,
    "statusCode": -2147352576,
    "statusMessage": "0 blocks filled"
}
```

Place blocks outside of the world [Error]
```json title="Command: /fill 0 -1 0 0 0 0 wool 10"
{
    "statusCode": -2147352576,
    "statusMessage": "Cannot place blocks outside of the world"
}
```

Too many blocks to fill [Error]

```json title="Command: /fill 0 0 0 50 50 50 wool 10"
{
    "statusCode": -2147352576,
    "statusMessage": "Too many blocks in the specified area (132651 > 32768)"
}
```

## Fog

!!! warning ""

    No documentation yet!

## Function

!!! warning ""

    No documentation yet!

## Gamemode

Successfully change player's gamemode
```json title="Command: /gamemode spectator"
{
    "gamemode": "%createWorldScreen.gameMode.spectator",
    "player": ["FrankyRayMS"],
    "statusCode": 0,
    "statusMessage": "Set FrankyRayMS's gamemode to Spectator"
}
```

List of `"gamemode"` value with the right gamemode name
```yaml
gamemode:
  - Creative: "%createWorldScreen.gameMode.creative"
  - Survival: "%createWorldScreen.gameMode.survival"
  - Adventure: "%createWorldScreen.gameMode.adventure"
  - Default: "%createWorldScreen.gameMode.serverDefault"
  - Spectator: "%createWorldScreen.gameMode.spectator"
```

## Gamerule

Update the value of game rule (Boolean)
```json title="/gamerule commandblockoutput false"
{
    "name": "commandblockoutput",
    "statusCode": 0,
    "statusMessage": "Game rule commandblockoutput has been updated to false",
    "value": false
}
```

Update the value of game rule (Integer/Number)
```json title="/gamerule randomtickspeed 4"
{
    "name": "randomtickspeed",
    "statusCode": 0,
    "statusMessage": "Game rule randomtickspeed has been updated to 4",
    "value": 4
}
```

## Gametest

!!! warning ""

    No documentation yet!

## Give

Successfully give an item to player
```json title="Command: /give @s apple"
{
    "itemAmount": 1,
    "itemName": "Apple",
    "playerName": ["FrankyRayMS"],
    "statusCode": 0,
    "statusMessage": "Gave Apple * 1 to FrankyRayMS"
}
```

## Help

!!! info ""

    Similar command: `/?`

Show help (Page)
```json title="Command: /help 1"
{
    "body": "<Too long message; Similar to statusMessage, output of command message>"
}
```

Show help (Command)
```json title="Command: /help camerashake"
{
    "command": "camerashake:",
    "description": "%commands.screenshake.description",
    "statusCode": 0,
    "statusMessage": "<Too long message>"
}
```

## Immutableworld

!!! warning ""

    No documentation yet!

## Kick

Trying to kick operator/admin of the world [Error]
```json title="Command: /kick FrankyRayMS"
{
    "statusCode": -2147352576,
    "statusMessage": "The host may not be kicked from the game."
}
```

!!! cite "[Public] Need test"

    Need testing for successful kicking player from the world

## Kill

Successfully kill the target
```json title="Command: /kill @a"
{
    "statusCode": 0,
    "statusMessage": "Killed Cow, Chicken, Egg, Skeleton, Skeleton, Chicken, Cow",
    "targetname": ["Cow","Chicken","Egg","Skeleton","Skeleton","Chicken","Cow"]
}
```

Cannot kill the target/no unkillable target [Error]
```json title="Command: /kill @s"
{
    "statusCode": -2147352576,
    "statusMessage": "No targets matched selector"
}
```

## List

```json
{
    "currentPlayerCount": 1,
    "maxPlayerCount": 8,
    "players": "FrankyRayMS",
    "statusCode": 0,
    "statusMessage": "There are 1/8 players online:\nFrankyRayMS"
}
```

## Locate

Locating structure
```json title="Command: /locate ancientcity || /locate structure ancientcity"
{
    "destination": {
        "x": 1352,
        "y": 64,
        "z": -1848
    },
    "feature": "%feature.ancientcity",
    "statusCode": 0,
    "statusMessage": "The nearest Ancient City is at block 1352, (y?), -1848 (2304 blocks away)"
}
```

Locating biome
```json title="Command: /locate biome plains"
{
    "statusCode": 0,
    "statusMessage": "The nearest plains is at block -101, 63, -210 (243 blocks away)"
}
```

!!! cite "[Personal/Public] Need Test"

    Need testing for check unreachable structure/biome location  
    "No valid structure found within a reasonable distance"

## Loot

!!! missing "Gametest Error"

    Gametest cannot run `/loot` for no reason.

    ```json title="Command: /loot give @s loot custom_loot_test"
    {
        "statusCode": -2147352576
    }
    ```

## Me

```json title="Command: /me Hello!"
{
    "statusCode": 0
}
```

## Mobevent

!!! warning ""

    No documentation yet!

## Msg

!!! info ""

    Similar command: `/tell` and `/w`

```json title="Command: /msg Hello!"
{
    "message": "Hello!",
    "recipient": ["FrankyRayMS"],
    "statusCode": 0,
    "statusMessage": "You whisper to FrankyRayMS: Hello!"
}
```

## Music

!!! warning ""

    No documentation yet!

## OP

!!! missing "Gametest Error"

    Gametest didn't support `/op` due to lowest permission level (required 2, got 1)

    ```json title="Command: /op @s"
    {
        "statusCode": -2147352576,
        "statusMessage": "Unknown command: op. Please check that the command exists and that you have permission to use it."
    }
    ```

## Particle

!!! warning ""

    No documentation yet!

## Playanimation

!!! warning ""

    No documentation yet!

## Playsound

!!! warning ""

    No documentation yet!

## Reload

!!! missing "Gametest Error"

    Gametest didn't support `/reload` due to lowest permission level (required 2, got 1)

    ```json title="Command: /reload @s"
    {
        "statusCode": -2147352576,
        "statusMessage": "Unknown command: reload. Please check that the command exists and that you have permission to use it."
    }
    ```

## Replaceitem

!!! warning ""

    No documentation yet!

## Ride

!!! warning ""

    No documentation yet!

## Say

```json title="Command: /say Hello!"
{
    "message": "Hello!",
    "statusCode": 0
}
```

## Schedule

!!! warning ""

    No documentation yet!

## Scoreboard

!!! warning ""

    No documentation yet!

## Setblock

Successfully set block
```json title="Command: /setblock 0 0 0 stone"
{
    "position": {
        "x": 0,
        "y": 0,
        "z": 0
    },
    "statusCode": 0,
    "statusMessage": "Block placed"
}
```

## Setmaxplayers

!!! missing "Gametest Error"

    Gametest didn't support `/setmaxplayers` due to lowest permission level (required 3, got 1)

    ```json title="Command: /setmaxplayers @s"
    {
        "statusCode": -2147352576,
        "statusMessage": "Unknown command: setmaxplayers. Please check that the command exists and that you have permission to use it."
    }
    ```

## Setworldspawn

```json
{
    "spawnPoint": {
        "x": -5,
        "y": 58,
        "z": 15
    },
    "statusCode": 0,
    "statusMessage": "Set the world spawn point to (-5, 58, 15)"
}
```

## Spawnpoint

```json title="Command: /spawnpoint @s"
{
    "player": ["FrankyRayMS"],
    "spawnPos": {
        "x": -5,
        "y": 58,
        "z": 15
    },
    "statusCode": 0,
    "statusMessage": "Set FrankyRayMS's spawn point to (-5, 58, 15)"
}
```

## Spreadplayers

```json title="Command: /spreadplayers -5 15 1 10 @a"
{
    "count": 1,
    "statusCode": 0,
    "statusMessage": "Successfully spread 1 players around -5.00,15.00",
    "victims": "FrankyRayMS",
    "x": -5,
    "z": 15
}
```

## Stopsound

!!! warning ""

    No documentation yet!

## Structure

!!! warning ""

    No documentation yet!