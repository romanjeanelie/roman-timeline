export default function addLineBreaks(element, text) {
  const lines = text.split("\n");

  element.textContent = "";

  lines.forEach((line, index) => {
    element.appendChild(document.createTextNode(line));

    if (index < lines.length - 1) {
      element.appendChild(document.createElement("br"));
    }
  });
}
