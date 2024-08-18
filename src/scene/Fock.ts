import { Object3D, Vector3 } from "three";
import { Bird } from "./Bird";
import { Entity } from "./Entity";
import { VerletObject3D } from "./VerletObject3D";

export class Flock extends Object3D implements Entity {
  BIRDS_NUMBER = 40;

  SEPARATION_RADIUS = 0.5;
  SEPARATION_FORCE = 5;

  ALIGNMENT_RADIUS = 2;
  ALIGNMENT_FORCE = 4;

  COHESION_RADIUS = 3;

  birds;
  constructor() {
    super();

    this.birds = [...Array(this.BIRDS_NUMBER)].map(() => {
      const bird = new Bird();
      this.add(bird);

      return bird;
    });
  }

  update(delta: number): void {
    this.applyFlockingBehaviour(this.birds);

    this.birds.forEach((bird) => bird.update(delta));
  }

  applyFlockingBehaviour(birds: VerletObject3D[]) {
    birds.forEach((currentBird, currentIndex) => {
      const birdsInAlignmentRange: VerletObject3D[] = [];
      const birdsInCohesionRange: VerletObject3D[] = [];

      birds.forEach((targetBird, targetIndex) => {
        if (currentIndex === targetIndex) {
          return;
        }

        const currentPos = currentBird.position.clone();
        const targetPos = targetBird.position.clone();
        const diff = targetPos.clone().sub(currentPos.clone());
        const distance = diff.length();

        // apply separation right awayt
        if (distance < this.SEPARATION_RADIUS) {
          currentBird.applyForce(
            diff.clone().normalize().multiplyScalar(-this.SEPARATION_FORCE),
          );
        }

        if (distance < this.ALIGNMENT_RADIUS) {
          birdsInAlignmentRange.push(targetBird);
        }

        if (distance < this.COHESION_RADIUS) {
          birdsInCohesionRange.push(targetBird);
        }
      });

      // apply alignment
      if (birdsInAlignmentRange.length > 0) {
        const avgAlignment = new Vector3();
        birdsInAlignmentRange.forEach((b) =>
          avgAlignment.add(b.velocity.clone()),
        );
        avgAlignment.divideScalar(birdsInAlignmentRange.length);

        const speedDiff = avgAlignment
          .clone()
          .sub(currentBird.velocity.clone());

        currentBird.applyForce(speedDiff.clone());
      }

      // apply cohesion
      if (birdsInCohesionRange.length > 0) {
        const center = new Vector3();
        birdsInCohesionRange.forEach((b) => center.add(b.position.clone()));
        center.divideScalar(birdsInCohesionRange.length);

        // const diff = center.clone().sub(currentBird.position)
        // currentBird.applyForce(
      }
    });
  }
}
