import Experience from "@/Experience/Experience.js";
import CopyButton from "@/CopyButton.js";
import projects from "@root/projects.json";

// Experience
new Experience({
  targetElement: document.querySelector(".experience"),
});

// Copy button
const textToCopy = projects
  .map((project) => {
    if (!project.url) return null;
    return `[${project.title} - ${project.type}](${project.url})`;
  })
  .filter(Boolean)
  .join("\n\n");

const buttonLinks = document.querySelector("#button-links");

new CopyButton({ element: buttonLinks, text: textToCopy, successText: "COPIED", errorText: "" });
