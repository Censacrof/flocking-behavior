import { useEffect, useRef } from "react";
import { setupScene } from "./scene/setupScene";

export function App() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1>Flocking Behaviour</h1>
      <ThreeContaier />
    </div>
  );
}

function ThreeContaier() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = ref.current;
    if (!target) {
      return;
    }

    const clean = setupScene(target);

    return () => {
      clean();
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ flexGrow: 1, alignSelf: "stretch", position: "relative" }}
    >
      <div
        id="overlay"
        style={{
          position: "absolute",
          textAlign: "end",
          width: "5rem",
          padding: "0.25rem",
          display: "flex",
          flexDirection: "column",
          right: "1rem",
          top: "1rem",
          backgroundColor: "#00ff0044",
        }}
      >
        <span id="fps">fps</span>
      </div>
    </div>
  );
}
