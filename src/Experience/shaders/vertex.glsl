varying vec2 vUv;

void main() {
	vec3 newposition = position;

	gl_Position = projectionMatrix * modelViewMatrix * vec4(newposition, 1.0);

	vUv = uv;
}