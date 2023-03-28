import { Scenario, History, Vec2D } from "../../types/data";

export const attachImage = (f: string): Promise<HTMLImageElement> => {
  return new Promise((res) => {
    const img = document.createElement("img");
    img.src = f;
    img.onload = () => {
      res(img);
    };
  });
};

export const createFutureRefs = (scenarios: Scenario[]) => {
  const promises = scenarios.map((s) => {
    return attachImage(`/videos/futures/${s.data}`);
  });
  return Promise.all(promises);
};

export const createHistoryRef = (hist: History): Promise<HTMLVideoElement> => {
  return new Promise((res) => {
    let video = document.createElement("video");
    video.src = `/videos/${hist.src}`;
    video.addEventListener("loadeddata", function () {
      video.currentTime = 0;
      res(video);
    });
  });
};

export const addVec = (a: Vec2D, b: Vec2D) => {
  return { x: a.x + b.x, y: b.x + a.x };
};

export const subVec = (a: Vec2D, b: Vec2D) => {
  return { x: a.x - b.x, y: a.y - b.y };
};
