import projects from "@root/projects.json";

export function getDistance(i) {
  const firstProject = projects[0];
  const lastProject = projects[projects.length - 1];
  const maxDistanceDate = new Date(lastProject.date) - new Date(firstProject.date);
  const project = projects[i];
  const distance = (new Date(project.date) - new Date(projects[0].date)) / maxDistanceDate;
  return distance;
}

export function getDistanceProjectByYear(year) {
  const firstProject = projects[0];
  const lastProject = projects[projects.length - 1];
  const maxDistanceDate = new Date(lastProject.date) - new Date(firstProject.date);
  const distance = (new Date(year) - new Date(projects[0].date)) / maxDistanceDate;
  return distance;
}

export function getDistanceBetweenTwoYears(year1, year2) {
  const firstProject = projects[0];
  const lastProject = projects[projects.length - 1];
  const maxDistanceDate = new Date(lastProject.date) - new Date(firstProject.date);
  const distance = (new Date(year1) - new Date(year2)) / maxDistanceDate;
  return distance;
}

export function getScaleY(i) {
  const project = projects[i];
  switch (project.type) {
    case "perso":
      return 0.5 + (project.top ? project.top : 0);
    case "pro":
      return 0.8 + (project.top ? project.top : 0);
    case "lab":
      return 0.3 + (project.top ? project.top : 0);
    case "indicator":
      return 1 + (project.top ? project.top : 0);
  }
}
