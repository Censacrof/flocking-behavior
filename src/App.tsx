import { Sky } from "three/addons/objects/Sky.js";
import * as THREE from "three";
import { useEffect, useRef } from "react";

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

    setupScene(target);

    return () => {
      target.innerHTML = "";
    };
  }, []);

  return <div ref={ref} style={{ flexGrow: 1, alignSelf: "stretch" }} />;
}

function setupScene(targetDiv: HTMLDivElement) {
  const WIDTH = targetDiv.clientWidth;
  const HEIGHT = targetDiv.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000);

  const gridHelper = new THREE.GridHelper();
  scene.add(gridHelper);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x00ff00,
  });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

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
  const CAMERA_ANGULAR_SPEED = 0.0025;
  camera.position.y = -2;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(WIDTH, HEIGHT);
  targetDiv.appendChild(renderer.domElement);

  let cameraAngle = 0;
  function animate() {
    cameraAngle += CAMERA_ANGULAR_SPEED;
    camera.position.x = CAMERA_RADIUS * Math.cos(cameraAngle);
    camera.position.z = CAMERA_RADIUS * Math.sin(cameraAngle);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(animate);
}
