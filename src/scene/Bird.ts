import { ConeGeometry, Mesh, MeshPhysicalMaterial } from "three";
import { VerletObject3D } from "./VerletObject3D";
import { degToRad } from "three/src/math/MathUtils.js";

export class Bird extends VerletObject3D {
  speed = 1;

  constructor() {
    super();

    const coneHeight = 0.5;
    const geometry = new ConeGeometry(0.1, coneHeight);
    const material = new MeshPhysicalMaterial({
      color: 0xff0000,
    });

    const mesh = new Mesh(geometry, material);
    mesh.position.setZ(-coneHeight / 2);
    mesh.rotateX(degToRad(-90));
    this.add(mesh);

    this.velocity.randomDirection().multiplyScalar(this.speed);
  }

  public update(delta: number) {
    this.lookAt(this.velocity.clone().multiplyScalar(-1).normalize());

    super.update(delta);
  }
}
