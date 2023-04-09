uniform float time;
uniform vec3 color;
varying vec2 vUv;
uniform sampler2D map;

// #pragma glslify: luma = require(glsl-luma)

float luma(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

float luma(vec4 color) {
  return dot(color.rgb, vec3(0.299, 0.587, 0.114));
}
float dither(vec2 position, float brightness) {
  int x = int(mod(position.x, 4.0));
  int y = int(mod(position.y, 4.0));
  int index = x + y * 4;
  float limit = 0.0;

  if (x < 8) {
    if (index == 0) limit = 0.0625;
    if (index == 1) limit = 0.5625;
    if (index == 2) limit = 0.1875;
    if (index == 3) limit = 0.6875;
    if (index == 4) limit = 0.8125;
    if (index == 5) limit = 0.3125;
    if (index == 6) limit = 0.9375;
    if (index == 7) limit = 0.4375;
    if (index == 8) limit = 0.25;
    if (index == 9) limit = 0.75;
    if (index == 10) limit = 0.125;
    if (index == 11) limit = 0.625;
    if (index == 12) limit = 1.0;
    if (index == 13) limit = 0.5;
    if (index == 14) limit = 0.875;
    if (index == 15) limit = 0.375;
  }

  return brightness < limit ? 0.0 : 1.0;
}

vec3 dither(vec2 position, vec3 color) {
  return color * dither(position, luma(color));
}

vec4 dither(vec2 position, vec4 color) {
  return vec4(color.rgb * dither(position, luma(color)), 1.0);
}



void main() {
    vec4 color = texture(map, vUv);


    float xRes = 200.0;
    float yRes = 200.0;
	
	float xFactor = float(xRes) / float(4);
	float yFactor = float(yRes) / float(4);

    vec2 p = vUv.st;

    float grid_uv_x = round(vUv.x * xFactor) / xFactor;
    float grid_uv_y = round(vUv.y * yFactor) / yFactor;

    vec4 dither_val = dither(vec2(grid_uv_x, grid_uv_y), color);
    gl_FragColor = vec4(dither_val);
    // gl_FragColor = color;
    // gl_FragColor.rgba = vec4(0.5 + 0.3 * sin(vUv.yxx + time) + color, 1.0);
}