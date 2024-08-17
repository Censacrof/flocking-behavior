import { Object3D, Vector3 } from "three";

import { Entity } from "./Entity";

export class VerletObject3D extends Object3D implements Entity {
  public mass = 1;
  public readonly velocity = new Vector3();
  public readonly acceleration = new Vector3();

  constructor() {
    super();
  }

  private forceToBeApplied: Vector3 = new Vector3();
  applyForce(force: Vector3) {
    this.forceToBeApplied.add(force);
  }

  public update(delta: number) {
    const newPosition = this.position
      .clone()
      .add(this.velocity.clone().multiplyScalar(delta))
      .add(this.acceleration.clone().multiplyScalar(0.5 * delta * delta));

    const newAcceleration = this.forceToBeApplied
      .clone()
      .divideScalar(this.mass);
    this.forceToBeApplied = new Vector3();

    const newVelocity = this.velocity.clone().add(
      this.acceleration
        .clone()
        .add(newAcceleration.clone())
        .multiplyScalar(0.5 * delta),
    );

    this.position.set(newPosition.x, newPosition.y, newPosition.z);
    this.velocity.set(newVelocity.x, newVelocity.y, newVelocity.z);
    this.acceleration.set(
      newAcceleration.x,
      newAcceleration.y,
      newAcceleration.z,
    );
  }
}
