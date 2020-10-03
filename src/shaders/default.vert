#define PI 3.1415926535
varying vec2 vUv;
uniform vec3 objectPosition;
varying vec3 vPosition;

void main() {
	vUv = uv;
	vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
