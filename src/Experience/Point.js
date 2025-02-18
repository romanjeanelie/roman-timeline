// Utils
import { getDistance, getScaleY } from "@/Experience/Utils/LinesUtils";
import addLineBreaks from "@/utils/addLineBreaks";
import gsap from "gsap";

export default class Point {
  constructor(options) {
    this.options = options;

    this.init();
  }

  init() {
    const { domEl, project, i } = this.options;

    const distance = getDistance(i);
    const scaleY = getScaleY(i);

    // Container
    this.containerEl = document.createElement("div");
    this.containerEl.classList.add("point-container");

    // Point
    this.pointEl = document.createElement("a");
    this.pointEl.href = project.url;
    this.pointEl.target = "_blank";
    this.pointEl.classList.add("point");
    this.pointEl.classList.add("point--" + project.type);

    this.pointEl.addEventListener("mouseenter", () => this.onMouseEnter());
    this.pointEl.addEventListener("mouseleave", () => this.onMouseLeave());

    // Circle
    this.circleEl = document.createElement("span");
    this.circleEl.classList.add("point__circle");
    this.pointEl.appendChild(this.circleEl);

    // Description
    this.descriptionEl = document.createElement("div");
    this.descriptionEl.classList.add("point__description");
    this.descriptionEl.classList.add("point__description--" + project.descriptionDirection);
    this.descriptionEl.classList.add("point__description--" + project.type);
    addLineBreaks(this.descriptionEl, project.title);

    // Container
    this.containerEl.appendChild(this.pointEl);
    this.containerEl.appendChild(this.descriptionEl);
    this.containerEl.style.top = `${scaleY * 100}%`;
    this.containerEl.style.left = `${distance * 100}%`;

    domEl.appendChild(this.containerEl);
  }

  onMouseEnter() {
    // Point
    gsap.killTweensOf(this.pointEl, this.circleEl, this.descriptionEl);
    gsap.to(this.pointEl, {
      scale: 0.8,
      duration: 0.5,
    });

    // Circle
    gsap.to(this.circleEl, {
      width: "400%",
      height: "400%",
      duration: 0.5,
      ease: "back.out(1.5)",
    });

    // Description
    gsap.to(this.descriptionEl, {
      opacity: 1,
    });
  }
  onMouseLeave() {
    gsap.killTweensOf(this.pointEl, this.circleEl, this.descriptionEl);

    // Point
    gsap.to(this.pointEl, {
      scale: 1,
    });

    // Circle
    gsap.to(this.circleEl, {
      width: "100%",
      height: "100%",
    });

    // Description
    gsap.to(this.descriptionEl, {
      opacity: 0,
    });
  }

  goToFinalPosition() {
    const { project } = this.options;

    // Point
    gsap.set(this.pointEl, {
      opacity: 1,
    });

    // Description
    gsap.set(this.descriptionEl, {
      opacity: project.type === "indicator" ? 1 : 0,
    });
  }
}
