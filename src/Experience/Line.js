import * as THREE from "three";
import gsap from "gsap";
import colors from "@/scss/variables/_colors.module.scss";

// Utils
import { getDistance, getScaleY } from "@/Experience/Utils/LinesUtils";

export default class Line {
  constructor(options) {
    this.options = options;
    this.viewportSizes = this.options.viewportSizes;

    // Config
    this.lineConfig = {
      start: {
        position: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        rotation: { x: 0, y: 2, z: (90 * Math.PI) / 180 },
      },
      target: {
        position: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        rotation: { x: 0, y: 0, z: 0 },
      },
    };
    this.isAnimComplete = false;
  }

  create() {
    const { geometry, material } = this.options;
    this.mesh = new THREE.Mesh(geometry, material.clone());
    this.mesh.rotation.z = (90 * Math.PI) / 180;

    this.options.group.add(this.mesh);
    this.setColor();
    this.positionLine();
  }

  setColor() {
    const { project } = this.options;
    this.mesh.material.uniforms.uColor.value = new THREE.Color(colors[project.type]);
    this.mesh.material.uniforms.uOpacity.value = project.type === "indicator" ? 0.2 : 1;
  }

  positionLine() {
    const { index, numberOfLines } = this.options;
    const distance = getDistance(index);
    const posY = gsap.utils.mapRange(1, 0, -this.viewportSizes.x, this.viewportSizes.x, index / numberOfLines) * 0.5;
    const posYTarget = gsap.utils.mapRange(1, 0, -this.viewportSizes.x, this.viewportSizes.x, distance) * 0.5;

    const scaleY = getScaleY(index);
    this.targetY = posYTarget;
    this.target = { position: { y: posYTarget }, scale: { y: scaleY } };

    this.mesh.scale.y = this.isAnimComplete ? this.viewportSizes.y * this.target.scale.y : this.viewportSizes.y;
    this.mesh.position.y = this.isAnimComplete ? this.targetY : posY;
  }

  animIn() {
    gsap.to(this.mesh.position, {
      y: this.target.position.y,
      delay: 3.6,
      duration: 3,
      ease: "expo.inOut",
      onComplete: () => {
        this.isAnimComplete = true;
      },
    });

    // Progress
    gsap.to(this.mesh.material.uniforms.uProgress, {
      value: 1,
      duration: 3,
      ease: "power2.inOut",
    });

    // Scale
    gsap.to(this.mesh.scale, {
      y: this.viewportSizes.y * this.target.scale.y,
      duration: 2,
      delay: 2,
      ease: "power2.inOut",
    });
    // to stay on top during the scale
    gsap.to(this.mesh.position, {
      x: this.viewportSizes.y / 2 - (this.viewportSizes.y * this.target.scale.y) / 2,
      duration: 2,
      delay: 2,

      ease: "power2.inOut",
    });

    // Colors
    gsap.to(this.mesh.material.uniforms.uColorProgress, {
      value: 1,
      duration: 2,
      delay: 2,

      ease: "power2.inOut",
    });
  }

  goToFinalPosition() {
    this.isAnimComplete = true;

    this.mesh.position.set(
      this.viewportSizes.y / 2 - (this.viewportSizes.y * this.target.scale.y) / 2,
      this.target.position.y,
      0
    );

    this.mesh.scale.y = this.viewportSizes.y * this.target.scale.y;

    gsap.set(this.mesh.material.uniforms.uColorProgress, {
      value: 1,
    });
    gsap.set(this.mesh.material.uniforms.uProgress, {
      value: 1,
    });
  }

  resize(viewportSizes) {
    this.viewportSizes = viewportSizes;
    this.positionLine();
  }

  update(amplitudeRotation, time) {
    this.mesh.rotation.y = this.options.index * amplitudeRotation;
    this.mesh.material.uniforms.uTime.value = time;
  }
}
