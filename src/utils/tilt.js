// 基准值：纵向平放时 alpha=90, beta=0, gamma=0
export const BASELINE_ALPHA = 90
export const BASELINE_BETA = 0
export const BASELINE_GAMMA = 0

// 最大倾斜角度
export const MAX_TILT = 15

/**
 * 根据鼠标位置计算容器倾斜角度
 * @param {number} mouseX - 鼠标 X 坐标
 * @param {number} mouseY - 鼠标 Y 坐标
 * @param {DOMRect} rect - 容器的 boundingClientRect
 * @returns {{x: number, y: number}} 旋转角度 {x: rotateX, y: rotateY}
 */
export function calculateContainerTilt(mouseX, mouseY, rect) {
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  // 计算鼠标相对于容器中心的偏移（-1 到 1）
  let percentX = (mouseX - centerX) / (rect.width / 2)
  let percentY = (mouseY - centerY) / (rect.height / 2)

  // 限制偏移范围在 -1 到 1 之间，防止角度过大
  percentX = Math.max(-1, Math.min(1, percentX))
  percentY = Math.max(-1, Math.min(1, percentY))

  // 限制最大倾斜角度为 15 度
  // 取反使卡片朝向鼠标方向倾斜
  const rotateY = -percentX * MAX_TILT
  const rotateX = percentY * MAX_TILT

  return { x: rotateX, y: rotateY }
}

/**
 * 从传感器值计算倾斜角度（相对于基准值）
 * @param {number} gamma - 传感器 gamma 值
 * @param {number} beta - 传感器 beta 值
 * @param {number} [_alpha] - 传感器 alpha 值（可选，当前未使用）
 * @returns {{x: number, y: number}} 旋转角度 {x: rotateX, y: rotateY}
 */
export function calculateTiltFromSensor(gamma, beta, _alpha) {
  // 计算相对于基准值的偏移
  const relativeGamma = gamma - BASELINE_GAMMA
  const relativeBeta = beta - BASELINE_BETA

  // gamma: -90 (左) 到 90 (右)，映射到 rotateY: -15 到 15
  // beta: -180 到 180，通常设备使用时在 -45 到 45 之间，映射到 rotateX: -15 到 15

  // 限制相对 beta 范围在 -45 到 45 之间（正常使用范围）
  const clampedBeta = Math.max(-45, Math.min(45, relativeBeta))

  const rotateY = (relativeGamma / 90) * MAX_TILT
  const rotateX = -(clampedBeta / 45) * MAX_TILT

  return { x: rotateX, y: rotateY }
}
