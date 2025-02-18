uniform float uTime;
uniform float uProgress;

uniform vec3 uColor;
uniform vec3 uColorStart;
uniform vec3 uColorBackground;
uniform float uColorProgress;

uniform float uOpacity;

varying vec2 vUv;

float stroke(float x, float size, float w) {
	float d = smoothstep(size - 0.1, size + 0.1, x + w * .5) - smoothstep(size - 0.1, size + 0.1, x - w * .5);
	return clamp(d, 0., 1.);
}

void main() {
	float progressY = stroke(vUv.y, 0.575, uProgress);

	float alpha = progressY * uOpacity;

	vec3 colorFinal = mix(uColorStart, uColor, uColorProgress);
	colorFinal = mix(uColorBackground, colorFinal, alpha);

	gl_FragColor = vec4(colorFinal, 1.);
}