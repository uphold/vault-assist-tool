export function hexToRgb(hex) {
  const colorRegex = new RegExp(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);

  const [, red, green, blue] = colorRegex.exec(hex).map((value) => parseInt(value, 16));

  return `rgb(${red}, ${green}, ${blue})`;
}
