/* Selector Parser */
const message =
  'type=zombie, name="The Zombie", scores={min=..0, max=0.., range=1..10, fixed=0, data=100..200, notrange=!1..10}, x=10, y=64, z=-15, dx=1, dy=2, dz=1]';

class SelectorParser {
  selector = {};
  volume = {};
  location = {};

  input = "";
  args = "";
  isQuoteString = false;

  isNestedArgs = false;
  nestedArgs = "";
  nestedData = {};

  data = {};

  mainParse(message) {
    console.log();

    for (let i = 0; i < message.length; i++) {
      const char = message[i];

      if (char == '"' && !this.isQuoteString) {
        this.isQuoteString = true;
        continue;
      } else if (char == '"') {
        this.isQuoteString = false;
        continue;
      } else if (this.isQuoteString) {
        this.input += char;
        continue;
      }

      if (char === "{" && !this.isNestedArgs) {
        this.isNestedArgs = true;
        this.nestedData = {};
        continue;
      } else if (this.isNestedArgs) {
        this.nestedArgsHandler(char);
        continue;
      }

      if (char === "=" && !this.args) {
        this.args = this.input.trim();
        this.input = "";
        continue;
      } else if ((char === "," || char === "]") && this.args) {
        this.data[this.args] = ["scores", "hasitem"].includes(this.args)
          ? this.nestedData
          : this.input;

        this.args = "";
        this.input = "";
        continue;
      }

      this.input += char;
    }

    console.log(this.data);
    this.selectorValidation();
    return this.selector;
  }

  nestedArgsHandler(char) {
    if (char === "}") {
      this.nestedData[this.nestedArgs] = this.input;
      this.nestedArgs = "";
      this.input = "";
      this.isNestedArgs = false;
    } else if (char === "=" && this.isNestedArgs) {
      this.nestedArgs = this.input.trim();
      this.input = "";
    } else if (char === "," && this.isNestedArgs) {
      this.nestedData[this.nestedArgs] = this.input;
      this.nestedArgs = "";
      this.input = "";
    } else {
      this.input += char;
    }
  }

  selectorValidation() {
    for (const [key, val] of Object.entries(this.data)) {
      switch (key.trim()) {
        case "c":
          if (val.startsWith("-")) this.selector.farthest = val;
          else this.selector.closest = val;
          break;

        case "dx":
          this.volume.x = Number(val);
          break;

        case "dy":
          this.volume.y = Number(val);
          break;

        case "dz":
          this.volume.z = Number(val);
          break;

        case "family":
          if (val.startsWith("!"))
            !this.selector.excludeFamilies
              ? (this.selector.excludeFamilies = [
                  val.startsWith('"') ? val.slice(2, -1) : val.slice(1),
                ])
              : this.selector.excludeFamilies.push(
                  val.startsWith('"') ? val.slice(2, -1) : val.slice(1)
                );
          else
            !this.selector.families
              ? (this.selector.families = [
                  val.startsWith('"') ? val.slice(1, -1) : val,
                ])
              : this.selector.families.push(
                  val.startsWith('"') ? val.slice(1, -1) : val
                );
          break;

        case "l":
          this.selector.maxLevel = Number(val);
          break;

        case "lm":
          this.selector.minLevel = Number(val);
          break;

        case "m":
          this.selector.gameMode = Number(val);
          break;

        case "name":
          if (val.startsWith("!"))
            !this.selector.excludeNames
              ? (this.selector.excludeNames = [
                  val.startsWith('"') ? val.slice(2, -1) : val.slice(1),
                  ,
                ])
              : this.selector.excludeNames.push(
                  val.startsWith('"') ? val.slice(2, -1) : val.slice(1)
                );
          else if (this.selector.name)
            throw new Error("Argument selector 'name' doubled");
          else
            this.selector.name = val.startsWith('"') ? val.slice(1, -1) : val;
          break;

        case "r":
          this.selector.maxDistance = Number(val);
          break;

        case "rm":
          this.selector.minDistance = Number(val);
          break;

        case "rx":
          this.selector.maxHorizontalRotation = Number(val);
          break;

        case "rxm":
          this.selector.minHorizontalRotation = Number(val);
          break;

        case "ry":
          this.selector.maxVerticalRotation = Number(val);
          break;

        case "rym":
          this.selector.minVerticalRotation = Number(val);
          break;

        case "scores":
          let scoreData = [];
          for (let [scoreKey, scoreValue] of Object.entries(this.data.scores)) {
            let scoreCurrent = {};
            scoreCurrent.objective = scoreKey;
            if (scoreValue.startsWith("!")) {
              scoreCurrent.exclude = true;
              scoreValue = scoreValue.slice(1);
            }

            let scoreValueRange = scoreValue.split("..");
            if (!scoreValueRange[0])
              scoreCurrent.maxScore = Number(scoreValueRange[1]);
            else if (!scoreValueRange[1])
              scoreCurrent.minScore = Number(scoreValueRange[0]);
            else {
              scoreCurrent.minScore = Number(scoreValueRange[0]);
              scoreCurrent.maxScore = Number(scoreValueRange[1]);
            }
            scoreData.push(scoreCurrent);
          }
          this.selector.scoreOptions = scoreData;
          break;

        case "tag":
          if (val.startsWith("!"))
            !this.selector.excludeTags
              ? (this.selector.excludeTags = [
                  val.startsWith('"') ? val.slice(2, -1) : val.slice(1),
                  ,
                ])
              : this.selector.excludeTags.push(
                  val.startsWith('"') ? val.slice(2, -1) : val.slice(1)
                );
          else
            !this.selector.tags
              ? (this.selector.tags = [
                  val.startsWith('"') ? val.slice(1, -1) : val,
                ])
              : this.selector.tags.push(
                  val.startsWith('"') ? val.slice(1, -1) : val
                );
          break;

        case "type":
          if (val.startsWith("!"))
            !this.selector.excludeTypes
              ? (this.selector.excludeTypes = [
                  val.startsWith('"') ? val.slice(2, -1) : val.slice(1),
                ])
              : this.selector.excludeTypes.push(
                  val.startsWith('"') ? val.slice(2, -1) : val.slice(1)
                );
          else if (this.selector.type)
            throw new Error("Argument selector 'type' doubled");
          else
            this.selector.type = val.startsWith('"') ? val.slice(1, -1) : val;
          break;

        case "x":
          this.location.x = Number(val);
          break;

        case "y":
          this.location.y = Number(val);
          break;

        case "z":
          this.location.z = Number(val);
          break;
      }
    }
    if (Object.keys(this.location).length !== 0)
      this.selector.location = this.location;
    if (Object.keys(this.volume).length !== 0)
      this.selector.volume = this.volume;
  }
}

// EntityQueryOption Interface Object
const sel = new SelectorParser().mainParse(message);
console.log(sel);
