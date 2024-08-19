import { Sky } from "three/examples/jsm/Addons.js";
import { Flock } from "./Flock";
import { degToRad, MathUtils } from "three/src/math/MathUtils.js";
import {
  DirectionalLight,
  DirectionalLightHelper,
  GridHelper,
  HemisphereLight,
  HemisphereLightHelper,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";

export function setupScene(targetDiv: HTMLDivElement) {
  const WIDTH = targetDiv.clientWidth;
  const HEIGHT = targetDiv.clientHeight;

  const scene = new Scene();
  const camera = new PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000);

  const gridHelper = new GridHelper();
  scene.add(gridHelper);

  const sky = new Sky();
  sky.scale.setScalar(450000);

  const phi = MathUtils.degToRad(88);
  const theta = MathUtils.degToRad(180);
  const sunPosition = new Vector3().setFromSphericalCoords(1, phi, theta);
  sky.material.uniforms.sunPosition.value = sunPosition;

  scene.add(sky);

  const MAX_AMBIENT_LIGHT = 0.5;
  const MIN_AMBIENT_LIGHT = 0.1;
  const sunContribution = Math.max(
    0,
    new Vector3(0, 1, 0).dot(sunPosition.normalize()),
  );
  const hemisphereLightIntensity = Math.max(
    MAX_AMBIENT_LIGHT * sunContribution,
    MIN_AMBIENT_LIGHT,
  );
  const hemisphereLight = new HemisphereLight(
    0xffffff,
    0xffffff,
    hemisphereLightIntensity,
  );
  scene.add(hemisphereLight);
  scene.add(new HemisphereLightHelper(hemisphereLight, 20));

  const MAX_DIRECTIONAL_LIGHT = 0.8;
  const directionalLightIntensity = MAX_DIRECTIONAL_LIGHT;
  const directionalLight = new DirectionalLight(
    0xffffff,
    directionalLightIntensity,
  );
  scene.add(directionalLight);
  scene.add(directionalLight.target);
  directionalLight.position.set(sunPosition.x, sunPosition.y, sunPosition.z);
  directionalLight.target.position.set(0, 0, 0);

  scene.add(new DirectionalLightHelper(directionalLight, 1));

  const CAMERA_RADIUS = 10;
  const CAMERA_ANGULAR_SPEED = 0.1;
  camera.position.y = 2;

  const renderer = new WebGLRenderer();
  renderer.setSize(WIDTH, HEIGHT);
  targetDiv.appendChild(renderer.domElement);

  let cameraAngle = degToRad(90);
  let previousTime = performance.now();

  let shouldUpdateFps = true;
  const fpsUpdateInterval = setInterval(() => {
    shouldUpdateFps = true;
  }, 250);

  const flock = new Flock();
  scene.add(flock);

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
    camera.lookAt(new Vector3(0, 0, 0));

    flock.update(/* delta */ 0.016);

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
