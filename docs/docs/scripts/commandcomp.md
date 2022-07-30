# Command Component

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

!!! cite "Test failed"

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