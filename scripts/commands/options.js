const commandOptions = {
  string: {
    // String length
    length: {
      min: 0,
      max: 2147483647, // (2^31 - 1) ~ Basically infinity
    },
  },

  number: {
    // Allow float/decimal value
    float: true,
    // Value range
    range: {
      min: -2147483648,
      max: 2147483647,
    },
    // Return string instead of number
    stringify: false,
  },

  boolean: {
    // Return string instead of boolean
    stringify: false,
  },

  object: {
    // Return string instead of object
    stringify: false,
  },

  block: {
    // Accept vanilla block only
    vanillaOnly: false,
    // Return block's ID instead of BlockType class
    stringify: false,
  },

  item: {
    // Accept vanilla item only
    vanillaOnly: false,
    // Return item's ID instead of ItemType class
    stringify: false,
  },

  location: {
    // Allow relative coordinate (~)
    relativeValue: false,
    // Allow local coordinate (^)
    localValue: false,
    // Enable/disable coordinate axis
    coordinateAxis: {
      x: true,
      y: true,
      z: true,
    },
    // Type of data returned
    // "Vector3", "Location", "BlockLocation"
    outputData: "Vector3",
    // Return string instead of "outputData" type
    stringify: false,
  },

  rotation: {
    // Allow relative coordinate (~)
    relativeValue: false,
    // Return string instead of ItemType class
    stringify: false,
  },

  selector: {},
};

export default commandOptions;
