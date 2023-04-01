import { Player } from "@minecraft/server";

function norm({ x, y, z }, s) {
  let l = Math.hypot(x, y, z);
  return {
    x: s * (x / l),
    y: s * (y / l),
    z: s * (z / l),
  };
}

function xa({ x, y, z }, s) {
  let m = Math.hypot(x, z);
  let a = {
    x: z,
    y: 0,
    z: -x,
  };

  return norm(a, s);
}

function ya({ x, y, z }, s) {
  let m = Math.hypot(x, z);

  let a = {
    x: (x / m) * -y,
    y: m,
    z: (z / m) * -y,
  };

  return norm(a, s);
}

function za(a, s) {
  return norm(a, s);
}

/**
 * Get Local Coordinate
 * @param {Player} player
 * @param {number} xf
 * @param {number} yf
 * @param {number} zf
 * @returns Object
 */
export default function rp(player, xf, yf, zf) {
  const l = player.location;
  const d = player.getViewDirection();

  let xx = xa(d, xf);
  let yy = ya(d, yf);
  let zz = za(d, zf);

  return {
    x: l.x + xx.x + yy.x + zz.x,
    y: l.y + xx.y + yy.y + zz.y,
    z: l.z + xx.z + yy.z + zz.z,
  };
}
