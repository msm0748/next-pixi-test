interface AdjustedImage {
  width: number
  height: number
  x: number
  y: number
}

export function adjustImageToCanvas(
  imageWidth: number,
  imageHeight: number,
  canvasWidth: number,
  canvasHeight: number
): AdjustedImage {
  const imgAspectRatio = imageWidth / imageHeight
  const canvasAspectRatio = canvasWidth / canvasHeight

  let width: number
  let height: number
  let x: number
  let y: number

  if (imgAspectRatio > canvasAspectRatio) {
    // Image is wider than canvas
    width = canvasWidth
    height = canvasWidth / imgAspectRatio
    x = 0
    y = (canvasHeight - height) / 2
  } else {
    // Image is taller than canvas
    height = canvasHeight
    width = canvasHeight * imgAspectRatio
    x = (canvasWidth - width) / 2
    y = 0
  }

  return { width, height, x, y }
}
