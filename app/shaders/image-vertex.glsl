precision highp float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uTime;
uniform float uSpeed;

varying vec2 vUv;

void main() {
  vUv = uv;

  vec3 p = position;

  p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
