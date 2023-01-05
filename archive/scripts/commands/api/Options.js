const commandOptions = {
  string: {
    // Allow escape character functional.
    // TODO: Not implemented.
    escapeChar: false,
    // String length.
    length: {
      min: 0,
      max: Infinity, // Basically infinity.
    },
  },

  number: {
    // Allow float/decimal value.
    floatType: true,
    // Value range.
    range: {
      min: -2147483648,
      max: 2147483647,
    },
    // Return string instead of number.
    stringify: false,
  },

  boolean: {
    // Return string instead of boolean.
    stringify: false,
  },

  object: {
    // Return string instead of object.
    stringify: false,
  },

  block: {
    // Accept vanilla block only.
    vanillaOnly: false,
    // Allow creative block to non-op player
    creativeMode: true,
    // Return block's ID instead of BlockType class.
    stringify: false,
  },

  item: {
    // Accept vanilla item only.
    vanillaOnly: false,
    // Allow creative item to non-op player
    creativeMode: true,

    /* Output */
    // Return item's ID instead of ItemType class.
    stringify: false,
  },

  location: {
    // Allow relative coordinate (~0).
    relativeValue: true,
    // Allow local coordinate (^0).
    // TODO: Not implemented.
    localValue: false,
    // Enable/disable coordinate axis.
    coordinateAxis: {
      x: true,
      y: true,
      z: true,
    },

    /* Output */
    // Type of data returned.
    // "Vector3", "Vector", "Location", "BlockLocation".
    outputData: "Vector3",
    // Return string instead of "outputData" type.
    stringify: false,
  },

  rotation: {
    // Allow relative rotation (~).
    relativeValue: false,
    // Return string instead of ItemType class.
    stringify: false,
  },

  selector: {},
};

// TODO: Need update more
export const creativeBlock = [
  "command_block",
  "structure_block",
  "structure_void",
  "barrier",
];

// TODO: Need update more
export const creativeItem = [...creativeBlock, "spawner_egg"];

export default commandOptions;
