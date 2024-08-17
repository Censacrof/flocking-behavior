import * as THREE from "three";
import { useEffect, useRef } from "react";

export function App() {
  return (
    <>
      <h1>Hello World</h1>
      <ThreeContaier />
    </>
  );
}

function ThreeContaier() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = ref.current;
    if (!target) {
      return;
    }

    setupScene(target);

    return () => {
      target.innerHTML = "";
    };
  }, []);

  return <div ref={ref} />;
}

function setupScene(targetDiv: HTMLDivElement) {
  const WIDTH = 600;
  const HEIGHT = 400;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x00ff00,
  });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  scene.add(directionalLight);

  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(WIDTH, HEIGHT);
  targetDiv.appendChild(renderer.domElement);

  function animate() {
    renderer.render(scene, camera);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  }
  renderer.setAnimationLoop(animate);
}
