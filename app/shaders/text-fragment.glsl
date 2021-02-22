uniform vec3 uColor;
uniform sampler2D tMap;

varying vec2 vUv;

void main() {
  vec3 color = texture2D(tMap, vUv).rgb;

  float signed = max(min(color.r, color.g), min(max(color.r, color.g), color.b)) - 0.5;
  float d = fwidth(signed);
  float alpha = smoothstep(-d, d, signed);

  if (alpha < 0.02) discard;

  gl_FragColor = vec4(uColor, alpha);
}
