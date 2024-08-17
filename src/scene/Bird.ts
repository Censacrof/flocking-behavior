import { Mesh, MeshPhysicalMaterial, SphereGeometry, Vector3 } from "three";
import { VerletObject3D } from "./VerletObject3D";

export class Bird extends VerletObject3D {
  constructor() {
    super();

    const geometry = new SphereGeometry(1);
    const material = new MeshPhysicalMaterial({
      color: 0xff0000,
    });
    const sphere = new Mesh(geometry, material);
    this.add(sphere);

    // this.applyForce(new Vector3(1, 0, 0));
  }

  public update(delta: number) {
    this.applyForce(new Vector3(0, -9.8, 0));
    super.update(delta);
  }
}
