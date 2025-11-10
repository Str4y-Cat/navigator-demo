import * as THREE from "three";

import Experience from "../Experiance";
import Environment from "./Environment";
import Floor from "./Floor";
import Block from "./Block";
import Flowers from "./Flowers";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // this.floor = new Floor();
    this.environment = new Environment();
    // this.block = new Block();

    this.resources.on("ready", () => {
      console.log("resourcse are ready");
      this.flowers = new Flowers();
    });

    //Setup
  }

  update() {
    // if (this.fox) this.fox.update();
    if (this.block) this.block.update();
  }
}
