import { Vec2D } from "@/types/data";
import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
export const socket = io(undefined);

export const directionToVector = (val: number, magnitude: number): Vec2D => {
  switch (val) {
    case 0: {
      /* left */
      return { x: -magnitude, y: 0 };
    }
    case 1: {
      /* right */
      return { x: magnitude, y: 0 };
    }
    case 2: {
      /* up */
      return { x: 0, y: magnitude };
    }
    case 3: {
      /* down */
      return { x: 0, y: -magnitude };
    }
  }
  return { x: 0, y: 0 };
};
