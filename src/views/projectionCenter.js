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
'use strict';

/**
 * @param {Number} projectionCenterX
 * @param {Number} projectionCenterY
 * @param {Number} vfov
 * @param {Number} hfov
 * @param {Object} result
 * @param {number} result.up
 * @param {number} result.down
 * @param {number} result.left
 * @param {number} result.right
 * @memberof RectilinearView.projectionCenter
 */
function viewParamsToVrFovs(projectionCenterX, projectionCenterY, vfov, hfov, result) {
  result = result || {};

  // When an offset is applied, the original center point of the image moves
  // offsetAngle is the angle that the center moves for a certain offset in
  // relative screen coordinates.
  var offsetAngleY = Math.atan(projectionCenterY * 2 * Math.tan(vfov/2));
  result.up = vfov/2 + offsetAngleY;
  result.down = vfov/2 - offsetAngleY;

  var offsetAngleX = Math.atan(projectionCenterX * 2 * Math.tan(hfov/2));
  result.left = hfov/2 + offsetAngleX;
  result.right = hfov/2 - offsetAngleX;

  return result;
}

/**
 * @param {Number} up
 * @param {Number} down
 * @param {Number} left
 * @param {Number} right
 * @param {Object} result
 * @param {number} result.projectionCenterX
 * @param {number} result.projectionCenterY
 * @param {number} result.vfov
 * @param {number} result.hfov
 * @memberof RectilinearView.projectionCenter
 */
function vrFovsToViewParams(up, down, left, right, result) {
  result = result || {};

  var vfov = up + down;
  var offsetAngleY = up - vfov/2;
  var projectionCenterY = Math.tan(offsetAngleY) / (2 * Math.tan(vfov/2));

  var hfov = right + left;
  var offsetAngleX = left - hfov/2;
  var projectionCenterX = Math.tan(offsetAngleX) / (2 * Math.tan(hfov/2));

  result.vfov = vfov;
  result.hfov = hfov;
  result.projectionCenterX = projectionCenterX;
  result.projectionCenterY = projectionCenterY;

  return result;
}

function vrFovsToProjectionMatrix(upFov, downFov, leftFov, rightFov, zNear, zFar, matrix) {
  var upTan = Math.tan(upFov);
  var downTan = Math.tan(downFov);
  var leftTan = Math.tan(leftFov);
  var rightTan = Math.tan(rightFov);
  var xScale = 2.0 / (leftTan + rightTan);
  var yScale = 2.0 / (upTan + downTan);

  matrix[0] = xScale;
  matrix[1] = 0.0;
  matrix[2] = 0.0;
  matrix[3] = 0.0;
  matrix[4] = 0.0;
  matrix[5] = yScale;
  matrix[6] = 0.0;
  matrix[7] = 0.0;
  matrix[8] = -((leftTan - rightTan) * xScale * 0.5);
  matrix[9] = ((upTan - downTan) * yScale * 0.5);
  matrix[10] = -(zNear + zFar) / (zFar - zNear);
  matrix[11] = -1.0;
  matrix[12] = 0.0;
  matrix[13] = 0.0;
  matrix[14] = -(2.0 * zFar * zNear) / (zFar - zNear);
  matrix[15] = 0.0;
}

var fovs = {};
function viewParamsToProjectionMatrix(projectionCenterX, projectionCenterY, vfov, hfov, zNear, zFar, matrix) {
  viewParamsToVrFovs(projectionCenterX, projectionCenterY, vfov, hfov, fovs);
  vrFovsToProjectionMatrix(fovs.up, fovs.down, fovs.left, fovs.right, zNear, zFar, matrix);
}

module.exports = {
  viewParamsToVrFovs: viewParamsToVrFovs,
  vrFovsToViewParams: vrFovsToViewParams,
  vrFovsToProjectionMatrix: vrFovsToProjectionMatrix,
  viewParamsToProjectionMatrix: viewParamsToProjectionMatrix
};