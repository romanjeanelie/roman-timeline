import * as THREE from "three";
import Experience from "@/Experience/Experience.js";
import Lines from "@/Experience/Lines.js";

export default class World {
  constructor(_options) {
    this.experience = new Experience();
    this.config = this.experience.config;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.setLines();
  }

  setLines() {
    this.lines = new Lines();
  }

  resize() {
    if (this.lines) this.lines.resize();
  }

  update() {
    if (this.lines) this.lines.update();
  }

  destroy() {}
}
