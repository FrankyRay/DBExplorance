// Archive
function argumentSelector(message) {
  let list = message.match(
      /(\w+)\s*\=\s*((?:\!?\w+)|(?:\!?\".+?\")|(?:\{.+?\}))/g
    ),
    data = {},
    location = {},
    volume = {};
  for (let i = 0; i < list.length; i++) {
    let [key, ...value] = list[i].split("=");
    value = value.join("=");

    switch (key.trim()) {
      case "c":
        if (value.startsWith("-")) data.farthest = value;
        else data.closest = value;
        break;

      case "dx":
        volume.x = Number(value);
        break;

      case "dy":
        volume.y = Number(value);
        break;

      case "dz":
        volume.z = Number(value);
        break;

      case "family":
        if (value.startsWith("!"))
          !data.excludeFamilies
            ? (data.excludeFamilies = [
                value.startsWith('"') ? value.slice(2, -1) : value.slice(1),
              ])
            : data.excludeFamilies.push(
                value.startsWith('"') ? value.slice(2, -1) : value.slice(1)
              );
        else
          !data.families
            ? (data.families = [
                value.startsWith('"') ? value.slice(1, -1) : value,
              ])
            : data.families.push(
                value.startsWith('"') ? value.slice(1, -1) : value
              );
        break;

      case "l":
        data.maxLevel = Number(value);
        break;

      case "lm":
        data.minLevel = Number(value);
        break;

      case "m":
        data.gameMode = Number(value);
        break;

      case "name":
        if (value.startsWith("!"))
          !data.excludeNames
            ? (data.excludeNames = [
                value.startsWith('"') ? value.slice(2, -1) : value.slice(1),
                ,
              ])
            : data.excludeNames.push(
                value.startsWith('"') ? value.slice(2, -1) : value.slice(1)
              );
        else if (data.name) throw new Error("Argument selector 'name' doubled");
        else data.name = value.startsWith('"') ? value.slice(1, -1) : value;
        break;

      case "r":
        data.maxDistance = Number(value);
        break;

      case "rm":
        data.minDistance = Number(value);
        break;

      case "rx":
        data.maxHorizontalRotation = Number(value);
        break;

      case "rxm":
        data.minHorizontalRotation = Number(value);
        break;

      case "ry":
        data.maxVerticalRotation = Number(value);
        break;

      case "rym":
        data.minVerticalRotation = Number(value);
        break;

      case "scores": // Need fix
        const scoreList = value.match(
          /(\w+)\s*\=\s*(?:\!?(\d+)?(\.\.)?(\d+)?)/g
        );
        if (scoreList.length === 0) break;

        let scoreData = [];
        for (const scoreArg of scoreList) {
          let scoreCurrent = {};
          let [scoreKey, scoreValue] = scoreArg.split("=");
          scoreCurrent.objective = scoreKey;
          if (scoreValue.startsWith("!")) {
            scoreCurrent.exclude = true;
            scoreValue = scoreValue.slice(1);
          }
          if (scoreValue.startsWith(".."))
            scoreCurrent.maxScore = scoreValue.replace("..", "");
          else if (scoreValue.endsWith(".."))
            scoreCurrent.minScore = scoreValue.replace("..", "");
          else {
            scoreCurrent.minScore = scoreValue.replace("..", "")[0];
            scoreCurrent.maxScore = scoreValue.replace("..", "")[1];
          }
          scoreData.push(scoreCurrent);
        }
        data.scoreOptions = scoreData;
        break;

      case "tag":
        if (value.startsWith("!"))
          !data.excludeTags
            ? (data.excludeTags = [
                value.startsWith('"') ? value.slice(2, -1) : value.slice(1),
                ,
              ])
            : data.excludeTags.push(
                value.startsWith('"') ? value.slice(2, -1) : value.slice(1)
              );
        else
          !data.tags
            ? (data.tags = [value.startsWith('"') ? value.slice(1, -1) : value])
            : data.tags.push(
                value.startsWith('"') ? value.slice(1, -1) : value
              );
        break;

      case "type":
        if (value.startsWith("!"))
          !data.excludeTypes
            ? (data.excludeTypes = [
                value.startsWith('"') ? value.slice(2, -1) : value.slice(1),
              ])
            : data.excludeTypes.push(
                value.startsWith('"') ? value.slice(2, -1) : value.slice(1)
              );
        else if (data.type) throw new Error("Argument selector 'type' doubled");
        else data.type = value.startsWith('"') ? value.slice(1, -1) : value;
        break;

      case "x":
        location.x = Number(value);
        break;

      case "y":
        location.y = Number(value);
        break;

      case "z":
        location.z = Number(value);
        break;
    }
  }
  if (Object.keys(location).length !== 0) data.location = location;
  if (Object.keys(volume).length !== 0) data.volume = volume;

  console.log(message, JSON.stringify(list), JSON.stringify(data));
  return data;
}
