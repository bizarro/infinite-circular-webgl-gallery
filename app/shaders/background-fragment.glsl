precision highp float;

uniform float uAlpha;
uniform vec3 uColor;

void main() {
  gl_FragColor.rgb = uColor;
  gl_FragColor.a = 1.0;
}
