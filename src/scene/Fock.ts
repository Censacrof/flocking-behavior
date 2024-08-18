import { Object3D } from "three";
import { Bird } from "./Bird";
import { Entity } from "./Entity";

export class Flock extends Object3D implements Entity {
  BIRDS_NUMBER = 20;

  birds;
  constructor() {
    super();

    this.birds = [...Array(20)].map(() => {
      const bird = new Bird();
      this.add(bird);

      return bird;
    });
  }

  update(delta: number): void {
    this.birds.forEach((bird) => bird.update(delta));
  }
}
