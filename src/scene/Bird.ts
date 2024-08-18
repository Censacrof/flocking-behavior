import { ConeGeometry, Mesh, MeshPhysicalMaterial } from "three";
import { VerletObject3D } from "./VerletObject3D";
import { degToRad } from "three/src/math/MathUtils.js";

export class Bird extends VerletObject3D {
  TARGET_SPEED = 3;
  MAX_DISTANCE_FROM_ORIGIN = 5;

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

    this.position.random().multiplyScalar(this.MAX_DISTANCE_FROM_ORIGIN);
    this.velocity.randomDirection().multiplyScalar(this.TARGET_SPEED);
  }

  public update(delta: number) {
    this.lookAt(
      this.position
        .clone()
        .add(this.velocity.clone().multiplyScalar(-1).normalize()),
    );

    if (this.position.clone().length() > this.MAX_DISTANCE_FROM_ORIGIN) {
      // this.position.normalize().multiplyScalar(this.MAX_DISTANCE_FROM_ORIGIN);
      this.applyForce(this.position.clone().normalize().multiplyScalar(-1));
    }

    if (this.velocity.clone().length() > this.TARGET_SPEED) {
      this.applyForce(
        this.velocity
          .clone()
          .normalize()
          .multiplyScalar(this.TARGET_SPEED)
          .sub(this.velocity.clone())
          .multiplyScalar(0.5),
      );
    }

    super.update(delta);
  }
}
