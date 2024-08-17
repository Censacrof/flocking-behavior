import { Sky } from "three/addons/objects/Sky.js";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { Bird } from "./scene/Bird";
import { degToRad } from "three/src/math/MathUtils.js";

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
      <h1>Hello World</h1>
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

function setupScene(targetDiv: HTMLDivElement) {
  const WIDTH = targetDiv.clientWidth;
  const HEIGHT = targetDiv.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000);

  const gridHelper = new THREE.GridHelper();
  scene.add(gridHelper);

  const sky = new Sky();
  sky.scale.setScalar(450000);

  const phi = THREE.MathUtils.degToRad(88);
  const theta = THREE.MathUtils.degToRad(180);
  const sunPosition = new THREE.Vector3().setFromSphericalCoords(1, phi, theta);
  sky.material.uniforms.sunPosition.value = sunPosition;

  scene.add(sky);

  const MAX_AMBIENT_LIGHT = 0.5;
  const MIN_AMBIENT_LIGHT = 0.1;
  const sunContribution = Math.max(
    0,
    new THREE.Vector3(0, 1, 0).dot(sunPosition.normalize()),
  );
  const hemisphereLightIntensity = Math.max(
    MAX_AMBIENT_LIGHT * sunContribution,
    MIN_AMBIENT_LIGHT,
  );
  const hemisphereLight = new THREE.HemisphereLight(
    0xffffff,
    0xffffff,
    hemisphereLightIntensity,
  );
  scene.add(hemisphereLight);
  scene.add(new THREE.HemisphereLightHelper(hemisphereLight, 20));

  const MAX_DIRECTIONAL_LIGHT = 0.8;
  const directionalLightIntensity = MAX_DIRECTIONAL_LIGHT;
  const directionalLight = new THREE.DirectionalLight(
    0xffffff,
    directionalLightIntensity,
  );
  scene.add(directionalLight);
  scene.add(directionalLight.target);
  directionalLight.position.set(sunPosition.x, sunPosition.y, sunPosition.z);
  directionalLight.target.position.set(0, 0, 0);

  scene.add(new THREE.DirectionalLightHelper(directionalLight, 1));

  const CAMERA_RADIUS = 10;
  const CAMERA_ANGULAR_SPEED = 0.1;
  camera.position.y = 2;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(WIDTH, HEIGHT);
  targetDiv.appendChild(renderer.domElement);

  const birds = [...Array(20)].map(() => {
    const bird = new Bird();
    scene.add(bird);

    return bird;
  });

  let cameraAngle = degToRad(90);
  let previousTime = performance.now();

  let shouldUpdateFps = true;
  const fpsUpdateInterval = setInterval(() => {
    shouldUpdateFps = true;
  }, 250);

  function animate() {
    const currentTime = performance.now();
    const delta = (currentTime - previousTime) / 1000;
    previousTime = currentTime;
    const fps = 1 / delta;

    // display fps
    if (shouldUpdateFps) {
      const $fps = targetDiv.querySelector("#fps");
      $fps!.textContent = `fps: ${fps.toFixed(0)}`;
      shouldUpdateFps = false;
    }

    cameraAngle += CAMERA_ANGULAR_SPEED * delta;
    camera.position.x = CAMERA_RADIUS * Math.cos(cameraAngle);
    camera.position.z = CAMERA_RADIUS * Math.sin(cameraAngle);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    birds.forEach((b) => b.update(delta));

    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(animate);

  const clean = () => {
    renderer.dispose();
    targetDiv.removeChild(renderer.domElement);

    clearInterval(fpsUpdateInterval);
  };

  return clean;
}
