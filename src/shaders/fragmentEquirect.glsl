/*
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform sampler2D uSampler;
uniform mat4 uPInvMatrix;
uniform float uOpacity;
varying vec2 vTextureCoord;
uniform vec4 colorOffset;
uniform mat4 colorMatrix;

uniform float textureX;
uniform float textureY;
uniform float textureWidth;
uniform float textureHeight;

const float PI = 3.14159265358979323846264;

void main(void) {
  float x = 2.0 * vTextureCoord.x - 1.0;
  float y = 2.0 * vTextureCoord.y - 1.0;
  vec4 pos = uPInvMatrix * vec4(x, y, 1.0, 1.0);
  float r = inversesqrt(pos.x * pos.x + pos.y * pos.y + pos.z * pos.z);
  float phi  = acos(pos.y * r);
  float theta = atan(pos.x, -1.0*pos.z);
  float s = 0.5 + 0.5 * theta / PI;
  float t = 1.0 - phi / PI;

  s = s * textureWidth + textureX;
  t = t * textureHeight + textureY;

  vec4 color = texture2D(uSampler, vec2(s, t));
  color = color * colorMatrix + colorOffset;
  gl_FragColor = vec4(color.rgb * color.a * uOpacity, color.a * uOpacity);
}
