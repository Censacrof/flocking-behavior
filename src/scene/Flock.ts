import { Object3D, Vector3 } from "three";

import { Boid } from "./Boid";
import { Entity } from "./Entity";
import { VerletObject3D } from "./VerletObject3D";
import { getSimulationParameters } from "./simulationParameters";

export class Flock extends Object3D implements Entity {
  boids;
  constructor() {
    super();

    const numberOfBoids = getSimulationParameters().numberOfBoids;

    this.boids = [...Array(numberOfBoids)].map(() => {
      const boid = new Boid();
      this.add(boid);

      return boid;
    });
  }

  update(delta: number): void {
    this.adjustNumberOfBoids();
    this.applyFlockingBehaviour(this.boids);

    this.boids.forEach((boid) => boid.update(delta));
  }

  adjustNumberOfBoids() {
    const targetNumberOfBoids = getSimulationParameters().numberOfBoids;
    const currentNumberOfBoids = this.boids.length;

    if (currentNumberOfBoids < targetNumberOfBoids) {
      [...new Array(targetNumberOfBoids - currentNumberOfBoids)].forEach(() => {
        const boid = new Boid();
        this.boids.push(boid);
        this.add(boid);
      });
    } else if (currentNumberOfBoids > targetNumberOfBoids) {
      for (let i = 0; i < currentNumberOfBoids - targetNumberOfBoids; i++) {
        const boid = this.boids.pop();
        if (boid) {
          this.remove(boid);
        }
      }
    }
  }

  applyFlockingBehaviour(boids: VerletObject3D[]) {
    const {
      separationRadius,
      separationForce,
      alignmentRadius,
      alignmentForce,
      cohesionRadius,
      cohesionForce,
    } = getSimulationParameters();

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
        if (distance < separationRadius) {
          currentBoid.applyForce(
            diff.clone().normalize().multiplyScalar(-separationForce),
          );
        }

        if (distance < alignmentRadius) {
          boidsInAlignmentRange.push(targetBoid);
        }

        if (distance < cohesionRadius) {
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

        currentBoid.applyForce(
          speedDiff.clone().multiplyScalar(alignmentForce),
        );
      }

      // apply cohesion
      if (boidsInCohesionRange.length > 0) {
        const center = new Vector3();
        boidsInCohesionRange.forEach((b) => center.add(b.position.clone()));
        center.divideScalar(boidsInCohesionRange.length);

        const diff = center.clone().sub(currentBoid.position);
        currentBoid.applyForce(
          diff.clone().normalize().multiplyScalar(cohesionForce),
        );
      }
    });
  }
}
