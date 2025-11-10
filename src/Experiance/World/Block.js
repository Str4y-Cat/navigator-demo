import * as THREE from "three";

import Experience from "../Experiance";

export default class Block {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.sizes = this.experience.sizes;
    this.debug = this.experience.debug;
    this.time = this.experience.time;

    //Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Test Floor");
    }

    //setUp
    this.setOptions();
    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();
  }

  setOptions() {
    this.options = {
      geometry: {
        w: 2,
        l: 2,
        h: 2,
      },
      material: {
        color: new THREE.Color("red"),
      },
    };
  }

  setDebug() {}

  setGeometry() {
    // this.geometry = new THREE.BoxGeometry(
    //   this.options.geometry.w,
    //   this.options.geometry.l,
    //   this.options.geometry.h,
    // );
    this.geometry = new THREE.IcosahedronGeometry();
  }

  setTextures() {
    return null;
  }

  setMaterial() {
    this.material = new THREE.MeshStandardMaterial({
      color: this.options.material.color,
    });
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.mesh.recieveShadow = true;

    this.mesh.position.y += 2;

    this.scene.add(this.mesh);
  }

  update() {
    const delta = this.time.delta * 0.001;

    this.mesh.rotation.x += delta;
    this.mesh.rotation.y += delta;
    this.mesh.rotation.z += delta;
  }
}
