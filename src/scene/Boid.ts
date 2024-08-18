import { ConeGeometry, Mesh, MeshPhysicalMaterial, Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils.js";

import { VerletObject3D } from "./VerletObject3D";

export class Boid extends VerletObject3D {
  TARGET_SPEED = 3;
  MAX_DISTANCE_FROM_ORIGIN = 10;

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

    this.position
      .random()
      .multiplyScalar(this.MAX_DISTANCE_FROM_ORIGIN * 2)
      .sub(
        new Vector3(
          this.MAX_DISTANCE_FROM_ORIGIN,
          this.MAX_DISTANCE_FROM_ORIGIN,
          this.MAX_DISTANCE_FROM_ORIGIN,
        ),
      );
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
      this.applyForce(this.position.clone().normalize().multiplyScalar(-5));
    }

    const targetVelocity = this.velocity
      .clone()
      .normalize()
      .multiplyScalar(this.TARGET_SPEED);
    const velocityDiff = targetVelocity.clone().sub(this.velocity);
    this.applyForce(velocityDiff.clone().multiplyScalar(0.8));

    super.update(delta);
  }
}
