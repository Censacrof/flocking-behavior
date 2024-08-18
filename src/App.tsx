import { useEffect, useRef } from "react";
import { setupScene } from "./scene/setupScene";

export function App() {
  return (
    <div className="fixed inset-0 flex flex-col">
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
    <div ref={ref} className="grow self-stretch relative">
      <div
        id="overlay"
        className="absolute text-end w-20 p-1 flex flex-col right-4 top-4 bg-slate-700 text-slate-50"
      >
        <span id="fps">fps</span>
      </div>
    </div>
  );
}
