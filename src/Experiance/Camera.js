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
    // this.controls = new DeviceOrientationControls(this.instance);

    window.addEventListener("deviceorientation", (event) => {
      console.log("device moved");
      const alpha = THREE.MathUtils.degToRad(event.alpha || 0);
      const beta = THREE.MathUtils.degToRad(event.beta || 0);
      const gamma = THREE.MathUtils.degToRad(event.gamma || 0);

      const euler = new THREE.Euler(beta, gamma, alpha, "YXZ");
      const quaternion = new THREE.Quaternion();
      quaternion.setFromEuler(euler);

      this.instance.setRotationFromQuaternion(quaternion);
    });
  }

  resize() {
    // console.log("DEBUG: Resizing Camera")

    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  updateCameraOrientation() {
    console.log("updating camera orientation");
    // Pull orientation data from window.orientationGlobal if available
    if (
      window.orientationGlobal &&
      typeof window.orientationGlobal === "object"
    ) {
      Sensors.orientationData.alpha =
        parseFloat(window.orientationGlobal.alpha) || 0; // 0..360 degrees
      Sensors.orientationData.beta =
        parseFloat(window.orientationGlobal.beta) || 0; // -180..180 degrees
      Sensors.orientationData.gamma =
        parseFloat(window.orientationGlobal.gamma) || 0; // -90..90 degrees
    }

    // Access orientation data directly from Sensors.orientationData
    const alphaDeg = Sensors.orientationData.alpha || 0; // 0..360 degrees
    const betaDeg = Sensors.orientationData.beta || 0; // -180..180 degrees
    const gammaDeg = Sensors.orientationData.gamma || 0; // -90..90 degrees

    // Fix decimal places for UI display
    const alphaConstraint = alphaDeg.toFixed(2);
    const betaConstraint = betaDeg.toFixed(2);
    const gammaConstraint = gammaDeg.toFixed(2);

    // Update UI fields with orientation data
    UI.updateField("Orientation_a", alphaConstraint);
    UI.updateField("Orientation_b", betaConstraint);
    UI.updateField("Orientation_g", gammaConstraint);

    // Optional: Replace alerts with console logs for debugging
    console.log(
      `Orientation Data - Alpha: ${alphaDeg}, Beta: ${betaDeg}, Gamma: ${gammaDeg}`,
    );

    // Check if compass data is available and accurate
    const hasCompass =
      Sensors.orientationData.webkitCompassHeading !== undefined &&
      Sensors.orientationData.webkitCompassAccuracy !== undefined &&
      Math.abs(Sensors.orientationData.webkitCompassAccuracy) <= 10; // Adjust threshold as needed

    let yawDeg;

    if (hasCompass) {
      // Use compass heading as yaw
      yawDeg = Sensors.orientationData.webkitCompassHeading;
      console.log(`Using compass heading for yaw: ${yawDeg} degrees`);
    } else {
      // Fallback: Calculate yaw using alpha
      yawDeg = alphaDeg;
      console.log(`Using alpha for yaw: ${yawDeg} degrees`);
    }

    // Convert degrees to radians
    const yawRad = THREE.MathUtils.degToRad(yawDeg);
    const pitchRad = THREE.MathUtils.degToRad(betaDeg);
    const rollRad = THREE.MathUtils.degToRad(gammaDeg);

    // Determine the screen orientation (0, 90, 180, 270 degrees)
    const screenOrientationDeg = window.orientation || 0;
    const screenOrientationRad = THREE.MathUtils.degToRad(screenOrientationDeg);

    // Adjust yaw based on screen orientation
    const adjustedYawRad = yawRad - screenOrientationRad;

    // Create quaternions for each rotation
    const quaternionYaw = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0), // Y-axis
      adjustedYawRad,
    );
    const quaternionPitch = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(1, 0, 0), // X-axis
      pitchRad,
    );
    const quaternionRoll = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 0, 1), // Z-axis
      -rollRad,
    );

    // Combine the quaternions: Yaw * Pitch * Roll
    const deviceQuaternion = new THREE.Quaternion()
      .multiply(quaternionYaw)
      .multiply(quaternionPitch)
      .multiply(quaternionRoll);

    // Reference Quaternion: Rotate -90 degrees around X-axis to align device frame with Three.js frame
    const referenceQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(-Math.PI / 2, 0, 0, "YXZ"), // -90 degrees around X-axis
    );

    // Combine Device Quaternion with Reference Quaternion
    const finalQuaternion = deviceQuaternion.multiply(referenceQuaternion);

    // Apply the final quaternion to the camera
    this.instance.quaternion.copy(finalQuaternion);

    // Optional: Log final quaternion for debugging
    console.log(
      `Final Quaternion: ${finalQuaternion.x}, ${finalQuaternion.y}, ${finalQuaternion.z}, ${finalQuaternion.w}`,
    );
  }

  update() {
    // console.log("DEBUG: Updating Camera")
    // this.controls.update();
  }
}
