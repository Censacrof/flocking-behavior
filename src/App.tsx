import { Sky } from "three/addons/objects/Sky.js";
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

  const gridHelper = new THREE.GridHelper();
  scene.add(gridHelper);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x00ff00,
  });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
  // scene.add(ambientLight);

  // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  // scene.add(directionalLight);
  // scene.add(directionalLight.target);

  // const directionalLightHelper = new THREE.DirectionalLightHelper(
  //   directionalLight,
  //   1,
  // );
  // scene.add(directionalLightHelper);

  const CAMERA_RADIUS = 5;
  const CAMERA_ANGULAR_SPEED = 0.01;
  camera.position.y = 1;

  const sky = new Sky();
  sky.scale.setScalar(450000);

  const phi = THREE.MathUtils.degToRad(90);
  const theta = THREE.MathUtils.degToRad(180);
  const sunPosition = new THREE.Vector3().setFromSphericalCoords(1, phi, theta);

  sky.material.uniforms.sunPosition.value = sunPosition;
  scene.add(sky);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(WIDTH, HEIGHT);
  targetDiv.appendChild(renderer.domElement);

  let cameraAngle = 0;
  function animate() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    cameraAngle += CAMERA_ANGULAR_SPEED;
    camera.position.x = CAMERA_RADIUS * Math.cos(cameraAngle);
    camera.position.z = CAMERA_RADIUS * Math.sin(cameraAngle);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(animate);
}
