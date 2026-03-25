import { Composition } from "remotion";
import { LogoAnimation } from "./LogoAnimation";

export const RemotionRoot = () => (
  <Composition
    id="main"
    component={LogoAnimation}
    durationInFrames={90}
    fps={30}
    width={1920}
    height={1080}
  />
);
