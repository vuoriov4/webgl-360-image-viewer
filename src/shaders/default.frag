#define PI 3.1415926535
#define K 7
uniform sampler2D color;
uniform vec2 resolution;
uniform int imageFormat; // 0 = hemi, 1 = cubemap
varying vec2 vUv;
varying vec3 vPosition;

vec2 uv_hemisphere(vec3 dir) {
    vec2 uv;
	uv.x = PI + atan(dir.z, dir.x);
	uv.y = PI - acos( dir.y );
	uv /= vec2( PI*2.0, PI );
	return uv;
}

vec2 uv_cube(vec3 dir) {
    float x = dir.x;
    float y = dir.y;
    float z = dir.z;
    float absX = abs(x);
    float absY = abs(y);
    float absZ = abs(z);
    float isXPositive = x > 0.0 ? 1.0 : 0.0;
    float isYPositive = y > 0.0 ? 1.0 : 0.0;
    float isZPositive = z > 0.0 ? 1.0 : 0.0;
    if (isXPositive > 0.5 && absX >= absY && absX >= absZ) {
        float uc = 1.0 - 0.5f * (-z / absX + 1.0f);
        float vc =  0.5f * (-y / absX + 1.0f);
        float i = 1.0;
        float j = 0.0;
        float iu = (uc + i) / 3.0;
        float iv = 1.0 - (vc + j) / 2.0;
        return vec2(iu, iv);
    }
    if (isXPositive < 0.5 && absX >= absY && absX >= absZ) {
        float uc = 1.0 - 0.5f * (z / absX + 1.0f);
        float vc = 1.0 - 0.5f * (y / absX + 1.0f);
        float i = 0.0;
        float j = 0.0;
        float iu = (uc + i) / 3.0;
        float iv = 1.0 - (vc + j) / 2.0;
        return vec2(iu, iv);
    }
    if (isYPositive > 0.5 && absY >= absX && absY >= absZ) {
        float uc = 0.5f * (-x / absY + 1.0f);
        float vc = 0.5f * (z / absY + 1.0f);
        float i = 2.0;
        float j = 0.0;
        float iu = (uc + i) / 3.0;
        float iv = 1.0 - (vc + j) / 2.0;
        return vec2(iu, iv);
    }
    if (isYPositive < 0.5 && absY >= absX && absY >= absZ) {
        float uc =  1.0 - 0.5f * (x / absY + 1.0f);
        float vc =  1.0 - 0.5f * (z / absY + 1.0f);
        float i = 0.0;
        float j = 1.0;
        float iu = (uc + i) / 3.0;
        float iv = 1.0 - (vc + j) / 2.0;
        return vec2(iu, iv);
    }
    if (isZPositive > 0.5 && absZ >= absX && absZ >= absY) {
        float uc = 1.0 - 0.5f * (x / absZ + 1.0f);
        float vc = 1.0 - 0.5f * (y / absZ + 1.0f);
        float i = 1.0;
        float j = 1.0;
        float iu = (uc + i) / 3.0;
        float iv = 1.0 - (vc + j) / 2.0;
        return vec2(iu, iv);
    }
    if (isZPositive < 0.5 && absZ >= absX && absZ >= absY) {
        // u (0 to 1) goes from +x to -x
        // v (0 to 1) goes from -y to +y
        float uc = 1.0 - 0.5f * (-x / absZ + 1.0f);
        float vc = 1.0 - 0.5f * (y / absZ + 1.0f);
        float i = 2.0;
        float j = 1.0;
        float iu = (uc + i) / 3.0;
        float iv = 1.0 - (vc + j) / 2.0;
        return vec2(iu, iv);
    }
}

void main() {
    if (imageFormat == 0) {
        vec3 dir = normalize(vPosition);
        gl_FragColor = texture2D(color, uv_hemisphere(dir));
    } else if (imageFormat == 1) {
        vec3 dir = normalize(vec3(vPosition.x, vPosition.y * 4.0/3.0, vPosition.z));
        gl_FragColor = texture2D(color, uv_cube(dir));
    } else {
        gl_FragColor = vec4(1, 0, 0, 1);
    }
}