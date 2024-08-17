import {
  Mesh,
  MeshPhysicalMaterial,
  Object3D,
  SphereGeometry,
  Vector3,
} from "three";

import { Entity } from "./entity";

export class VerletObject3D extends Object3D implements Entity {
  mass = 1;
  readonly velocity = new Vector3(0, 0, 0);
  readonly acceleration = new Vector3(0, 0, 0);

  constructor() {
    super();

    const geometry = new SphereGeometry(1);
    const material = new MeshPhysicalMaterial({
      color: 0xff0000,
    });
    const sphere = new Mesh(geometry, material);
    this.add(sphere);
  }

  private forceToBeApplied: Vector3 = new Vector3(0, 0, 0);
  applyForce(force: Vector3) {
    this.forceToBeApplied = this.forceToBeApplied.add(force);
  }

  update = (delta: number) => {
    const newPosition = this.position
      .add(this.velocity.multiplyScalar(delta))
      .add(this.acceleration.multiplyScalar(delta * delta * 0.5));

    const newAcceleration = this.forceToBeApplied.divideScalar(this.mass);
    this.forceToBeApplied = new Vector3(0, 0, 0);

    const newVelocity = this.velocity.add(
      this.acceleration.add(newAcceleration).multiplyScalar(delta * 0.5),
    );

    this.position.set(newPosition.x, newPosition.y, newPosition.z);
    this.velocity.set(newVelocity.x, newVelocity.y, newVelocity.z);
    this.acceleration.set(
      newAcceleration.x,
      newAcceleration.y,
      newAcceleration.z,
    );
  };
}
