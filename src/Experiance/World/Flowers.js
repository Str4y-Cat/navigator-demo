import * as THREE from "three";
import Experience from "../Experiance";

export default class Flowers {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.resources = this.experience.resources;

    this.setConstants();
    this.setCoords();

    //Setup
    this.resource = this.resources.items.flowerModel;
    this.setMaterial();
    this.setModel();

    // this.setGeometry();

    // this.setMeshes();
  }

  setConstants() {
    this.values = {
      size: 1,
      starCount: 400,
      radius: 40,
      yCutoff: 1,
      diffScale: 10,
      opacity: 1,
    };
  }

  setModel() {
    this.model = this.resource.scene;
    // this.model.scale.set(0.02, 0.02, 0.02);
    // this.scene.add(this.model);

    // this.model.traverse((child) => {
    //   if (child instanceof THREE.Mesh) {
    //     console.log(child);
    //     child.castShadow = true;
    //     console.log(child.castShadow);
    //   }
    // });
    // this.model_array = [];
    // this.sphericalCoords.forEach((coord) => {
    //   // mesh.position.set(coord.x, coord.y, coord.z);
    //
    //   mesh.position.x = coord.x;
    //   mesh.position.y = coord.y;
    //   mesh.position.z = coord.z;
    //
    //   this.scene.add(mesh);
    //   console.log("adding mesh at point : ", coord, mesh);
    //   this.mesh_array.push(mesh);
    //
    //
    // });
    //

    let dummy = this.resource.scene.children[0];

    console.log(dummy);

    let mesh = new THREE.InstancedMesh(
      dummy.geometry,
      this.material,
      this.values.starCount,
    );

    this.sphericalCoords.forEach((coord, i) => {
      dummy.position.set(coord.x, coord.y, coord.z);

      dummy.scale.set(0.1, 0.1, 0.1);

      dummy.rotation.set(
        Math.PI * Math.random() * 2,
        Math.PI * Math.random() * 2,
        Math.PI * Math.random() * 2,
      );

      dummy.updateMatrix();

      mesh.setMatrixAt(i, dummy.matrix);

      mesh.setColorAt(
        i,
        new THREE.Color(`hsl(${Math.random() * 360}, 50%, 66%)`),
      );
    });

    this.scene.add(mesh);
  }

  setCoords() {
    this.sphericalCoords = [];
    for (let i = 0; i < this.values.starCount; i++) {
      const vec3 = new THREE.Vector3().setFromSphericalCoords(
        this.values.radius + Math.random() * this.values.diffScale,
        Math.random() * Math.PI,
        Math.random() * 2 * Math.PI,
      );

      this.sphericalCoords.push(vec3);
    }
  }

  setGeometry() {
    this.geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  }
  createGeometry() {
    const size = this.randomSize(0.4, 0.7);
    console.log(size);
    return new THREE.BoxGeometry(size, size, size);
  }

  setMaterial() {
    const material = new THREE.MeshToonMaterial({});
    this.material = material;
  }

  setMeshes() {
    this.mesh_array = [];
    this.sphericalCoords.forEach((coord) => {
      const mesh = new THREE.Mesh(this.createGeometry(), this.material);
      // mesh.position.set(coord.x, coord.y, coord.z);

      mesh.position.x = coord.x;
      mesh.position.y = coord.y;
      mesh.position.z = coord.z;

      this.scene.add(mesh);
      console.log("adding mesh at point : ", coord, mesh);
      this.mesh_array.push(mesh);
    });
  }

  randomSize(min = 0, max = 2000) {
    let size = this.values.size * Math.random();
    size = Math.min(size, max);
    size = Math.max(size, min);

    return size;
  }

  update() {
    // if (this.particles) {
    //   this.particles.rotation.z += (this.time.delta / 10000) * Math.PI * 0.01;
    // }
  }
}
