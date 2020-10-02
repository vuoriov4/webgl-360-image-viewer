#define PI 3.1415926535
#define K 7
uniform sampler2D texture_hemisphere;
uniform vec2 resolution;
varying vec2 vUv;
varying vec3 vPosition;

vec2 uv_hemisphere(vec3 dir) {
    vec2 uv;
	uv.x = PI + atan(dir.z, dir.x);
	uv.y = PI - acos( dir.y );
	uv /= vec2( PI*2.0, PI );
	return uv;
}

void main() {
    vec3 dir = normalize(vPosition);
    gl_FragColor = texture2D(texture_hemisphere, uv_hemisphere(dir));
}