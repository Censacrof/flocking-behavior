import { Object3D, Vector3 } from "three";

import { Boid } from "./Boid";
import { Entity } from "./Entity";
import { VerletObject3D } from "./VerletObject3D";

export class Flock extends Object3D implements Entity {
  BOIDS_NUMBER = 200;

  SEPARATION_RADIUS = 0.5;
  SEPARATION_FORCE = 5;

  ALIGNMENT_RADIUS = 2;
  ALIGNMENT_FORCE = 2;

  COHESION_RADIUS = 6;
  COHESION_FORCE = 0.1;

  boids;
  constructor() {
    super();

    this.boids = [...Array(this.BOIDS_NUMBER)].map(() => {
      const boid = new Boid();
      this.add(boid);

      return boid;
    });
  }

  update(delta: number): void {
    this.applyFlockingBehaviour(this.boids);

    this.boids.forEach((boid) => boid.update(delta));
  }

  applyFlockingBehaviour(boids: VerletObject3D[]) {
    boids.forEach((currentBoid, currentIndex) => {
      const boidsInAlignmentRange: VerletObject3D[] = [];
      const boidsInCohesionRange: VerletObject3D[] = [];

      boids.forEach((targetBoid, targetIndex) => {
        if (currentIndex === targetIndex) {
          return;
        }

        const currentPos = currentBoid.position.clone();
        const targetPos = targetBoid.position.clone();
        const diff = targetPos.clone().sub(currentPos.clone());
        const distance = diff.length();

        // apply separation right awayt
        if (distance < this.SEPARATION_RADIUS) {
          currentBoid.applyForce(
            diff.clone().normalize().multiplyScalar(-this.SEPARATION_FORCE),
          );
        }

        if (distance < this.ALIGNMENT_RADIUS) {
          boidsInAlignmentRange.push(targetBoid);
        }

        if (distance < this.COHESION_RADIUS) {
          boidsInCohesionRange.push(targetBoid);
        }
      });

      // apply alignment
      if (boidsInAlignmentRange.length > 0) {
        const avgAlignment = new Vector3();
        boidsInAlignmentRange.forEach((b) =>
          avgAlignment.add(b.velocity.clone()),
        );
        avgAlignment.divideScalar(boidsInAlignmentRange.length);

        const speedDiff = avgAlignment
          .clone()
          .sub(currentBoid.velocity.clone());

        currentBoid.applyForce(speedDiff.clone());
      }

      // apply cohesion
      if (boidsInCohesionRange.length > 0) {
        const center = new Vector3();
        boidsInCohesionRange.forEach((b) => center.add(b.position.clone()));
        center.divideScalar(boidsInCohesionRange.length);

        const diff = center.clone().sub(currentBoid.position);
        currentBoid.applyForce(
          diff.clone().normalize().multiplyScalar(this.COHESION_FORCE),
        );
      }
    });
  }
}
