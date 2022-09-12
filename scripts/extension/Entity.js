import { Player, Entity } from "mojang-minecraft";

const EntityExtension = {
  uid() {
    return this.scoreboard.id;
  },
  getName() {
    return this.name;
  },
};

const PlayerExtension = {
  ...EntityExtension,
  getItem(slot = null) {
    return this.getComponent("inventory").container.getItem(
      slot ?? this.selectedSlot
    );
  },
};

Object.assign(Entity.prototype, EntityExtension);
Object.assign(Player.prototype, PlayerExtension);
