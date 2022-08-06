import { world } from "mojang-minecraft";
import {
  ActionFormData,
  MessageFormData,
  ModalFormData,
} from "mojang-minecraft-ui";
import GetScore from "../../lib/GetScore.js";

export default function ExecuteCommandMode(player) {
  if (GetScore("ExecuteType", "OptConsC") === 1) {
    NewExecute(player);
  } else {
    OldExecute(player);
  }
}

function OldExecute() {}

function NewExecute() {}
