#define PI 3.1415926535
varying vec2 vUv;
varying vec3 vPosition;
uniform sampler2D texture_depth;

vec2 uv_hemisphere(vec3 dir) {
    vec2 uv;
	uv.x = PI + atan( dir.z, dir.x );
	uv.y = PI - acos( dir.y );
	uv /= vec2( PI*2.0, PI );
	return uv;
}

void main() {
	vUv = uv;
	vPosition = position;
  	vec4 depth = texture2D(texture_depth, uv_hemisphere(normalize(position)));
	gl_Position = projectionMatrix * modelViewMatrix * vec4(depth.x * normalize(position), 1.0);
}
