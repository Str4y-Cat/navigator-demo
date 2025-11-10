import * as THREE from "three";
// import * as THREE from "../build/three.module.js";
import Experience from "./Experiance";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DeviceOrientationControls } from "./Utils/DeviceOrientationControls";

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;

    // console.log("camera")

    console.log(DeviceOrientationControls);

    this.setInstance();
    // this.setOrbitControls();
    this.setDeviceOrientationControls();
  }

  setInstance() {
    // this.instance=new THREE.PerspectiveCamera(
    //     35,
    //     this.sizes.width/this.sizes.height,
    //     0.1,
    //     100
    // )
    this.instance = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      100,
    );

    this.instance.position.set(0, 0, 0);

    // console.log()
    this.scene.add(this.instance);
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
    const target = new THREE.Vector3(0, 0, 2);
    this.controls.target = target;
  }

  setDeviceOrientationControls() {
    console.log("setting oriendtation controls");
    this.controls = new DeviceOrientationControls(this.instance);
  }

  resize() {
    // console.log("DEBUG: Resizing Camera")

    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    // console.log("DEBUG: Updating Camera")
    this.controls.update();
  }
}
