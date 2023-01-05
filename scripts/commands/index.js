import CustomCommand from "./CustomCommand";
// import "./misc";
// import "./item";

CustomCommand.addCommand({
  name: "test",
  description: "Use for debug only",
  operator: true,
  arguments: [
    {
      name: "str",
      description: "String argument",
      type: "string",
    },
    {
      name: "int",
      description: "Integer argument",
      type: "number",
      options: {
        floatType: false,
        range: {
          min: 0,
        },
      },
      default: -1,
    },
    {
      name: "loc",
      description: "Location argument",
      type: "location",
      options: {
        relativeValue: false,
        coordinateAxis: {
          y: false,
        },
        zeroDefaultValue: true,
      },
      default: { x: 0, y: 0, z: 0 },
    },
    {
      name: "rot",
      description: "Rotation argument",
      type: "rotation",
      options: {
        relativeValue: false,
      },
      default: { x: 0, y: 0 },
    },
  ],
  callback: (player, data) =>
    console.log(player.name ?? player, JSON.stringify(data)),
});

CustomCommand.addCommand({
  name: "hello",
  description: "Say hello",
  arguments: [
    {
      name: "name",
      description: "Name of the player",
      type: "string",
      default: null,
    },
  ],
  callback: (player, data) =>
    console.log(`Hello ${data.name ?? player.name ?? "World"}!`),
});
