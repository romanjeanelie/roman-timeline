import projects from "@root/projects.json";

import Experience from "@/Experience/Experience";
import Line from "@/Experience/Line";
import Years from "@/Experience/Years";
import Point from "@/Experience/Point";

// Shader
import vertexShader from "@/Experience/shaders/vertex.glsl";
import fragmentShader from "@/Experience/shaders/fragment.glsl";

import { lineColorStart, colorBackground } from "@/scss/variables/_colors.module.scss";

import * as THREE from "three";
import gsap from "gsap";
export default class Lines {
  constructor() {
    this.experience = new Experience();
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;

    this.projects = projects;

    // DOM
    this.domEl = document.querySelector(".dom");

    // Config
    this.lineColor = "#d0cfcf";
    this.amplitudeRotation = { value: 0.3 };
    this.groupConfig = {
      start: {
        position: { x: 0, y: 0, z: 0 },
        scale: { x: 0.9, y: 3, z: 1 },
        rotation: { x: 0, y: 2, z: Math.PI * 0 },
      },
      target: {
        position: { x: 0, y: 0, z: 0 },
        scale: { x: 0.7, y: 0.9, z: 0.7 },
        rotation: { x: 0, y: 0, z: Math.PI * 0.5 },
      },
    };

    this.numberOfLines = projects.length - 1;
    this.positions = { x: 0, y: 0, z: 0 };
    this.viewportSizes = { x: 0, y: 0 };

    this.linesInstances = [];
    this.points = [];

    if (this.debug) {
      this.debugFolder = this.debug.addFolder("lines");
    }

    this.computeViewportSizes();

    this.setDOM();
    this.setYears();
    this.setPoints();
    this.setLines();

    this.startAnim();
    // this.goToFinalPosition();
  }

  setDOM() {
    this.domEl.style.width = `${100 * this.groupConfig.target.scale.y}%`;
    this.domEl.style.height = `${100 * this.groupConfig.target.scale.x}%`;
  }

  setPoints() {
    this.points = this.projects.map((project, i) => new Point({ project, i, domEl: this.domEl }));
  }

  setYears() {
    this.years = new Years({ domEl: this.domEl });
  }

  setLines() {
    this.group = new THREE.Group();

    var lineGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 32);
    var lineMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uColorStart: { value: new THREE.Color(lineColorStart) },
        uColorBackground: { value: new THREE.Color(colorBackground) },
        uColor: { value: new THREE.Color(0xffffff) },
        uColorProgress: { value: 0 },
        uOpacity: { value: 1 },
        uTime: { value: 0 },
        uProgress: { value: 0 },
      },
    });

    this.projects.forEach((project, i) => {
      const line = new Line({
        index: i,
        geometry: lineGeometry,
        material: lineMaterial,
        viewportSizes: this.viewportSizes,
        group: this.group,
        numberOfLines: this.numberOfLines,
        project,
      });

      line.create();

      this.linesInstances.push(line);
    });

    this.group.scale.set(
      this.groupConfig.start.scale.x,
      this.groupConfig.start.scale.y,
      this.groupConfig.start.scale.z
    );
    this.group.rotation.set(
      this.groupConfig.start.rotation.x,
      this.groupConfig.start.rotation.y,
      this.groupConfig.start.rotation.z
    );

    this.scene.add(this.group);
  }

  startAnim() {
    document.body.classList.remove("loading");

    const tl = gsap.timeline();

    // Anim group
    tl.to(this.amplitudeRotation, {
      value: 0,
      duration: 7.3,
      delay: 0.5,

      ease: "power2.out",
    });
    tl.to(
      this.group.scale,
      {
        ...this.groupConfig.target.scale,
        duration: 4,
        ease: "power1.inOut",
      },
      "<"
    );
    tl.to(
      this.group.rotation,
      {
        x: this.groupConfig.target.rotation.x,
        y: this.groupConfig.target.rotation.y,
        duration: 3,
        ease: "power1.inOut",
      },
      "<"
    );
    tl.to(
      this.group.rotation,
      {
        z: this.groupConfig.target.rotation.z,
        duration: 2,
        ease: "power2.inOut",
      },
      "<"
    );

    // Anim Lines
    this.linesInstances.forEach((line, i) => {
      line.animIn();
    });

    // Anim points
    tl.fromTo(
      ".point",
      { scale: 0, opacity: 1 },
      {
        opacity: 1,
        scale: 1,
        duration: 2.5,
        ease: "power2.out",
        stagger: {
          each: 0.25,
          from: "center",
          grid: "auto",
        },
      },
      "-=2"
    );

    // Anim years
    this.years.animIn({ delay: 5 });

    // Anim indicator
    gsap.fromTo(
      ".point__description--indicator",
      { opacity: 0, xPercent: -20 },
      {
        xPercent: 0,
        opacity: 1,
        delay: 3.5,
        duration: 3,
        stagger: 0.1,
        ease: "expo.inOut",
      }
    );

    // Anim legends
    gsap.fromTo(
      [".legends", ".buttons"],
      { opacity: 0, yPercent: 100 },
      {
        yPercent: 0,
        opacity: 1,
        delay: 6,
        duration: 1.5,
        ease: "power2.inOut",
      }
    );

    // Anim presentation
    gsap.fromTo(
      [".presentation"],
      { opacity: 0, yPercent: 25 },
      {
        yPercent: 0,
        opacity: 1,
        delay: 5.5,
        duration: 2,
        ease: "power2.inOut",
      }
    );
  }

  goToFinalPosition() {
    document.body.classList.remove("loading");

    this.group.scale.set(
      this.groupConfig.target.scale.x,
      this.groupConfig.target.scale.y,
      this.groupConfig.target.scale.z
    );
    this.group.rotation.set(
      this.groupConfig.target.rotation.x,
      this.groupConfig.target.rotation.y,
      this.groupConfig.target.rotation.z
    );
    this.amplitudeRotation.value = 0;

    this.linesInstances.forEach((line, i) => {
      line.goToFinalPosition();
    });

    this.points.forEach((point, i) => {
      point.goToFinalPosition();
    });
  }

  computeViewportSizes() {
    const distance = Math.abs(this.positions.z - this.camera.instance.position.z);
    const verticalFOV = this.camera.instance.fov * (Math.PI / 180);
    const y = 2 * Math.tan(verticalFOV / 2) * distance;
    const x = y * this.camera.instance.aspect;

    this.viewportSizes = {
      x,
      y,
    };
  }

  resize() {
    this.computeViewportSizes();
    this.linesInstances.forEach((line, i) => {
      line.resize(this.viewportSizes);
    });
  }

  update() {
    this.linesInstances.forEach((line, i) => {
      const time = this.experience.time.elapsed;
      line.update(this.amplitudeRotation.value, time);
    });
  }

  destroy() {}
}
