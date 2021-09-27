/**
 * 使用wh压缩img
 * @param {*} img 
 * @param {*} wh 
 */
export default function(img, wh) {

  var { canvas, cc } = this;
  var [targetWidth, targetHeight] = wh;
  var { width, height } = img;

  console.log("原始尺寸",width, height);
  console.log("压缩后尺寸", targetWidth, targetHeight)

  canvas.width = targetWidth;
  canvas.height = targetHeight;
  cc.clearRect(0, 0, targetWidth, targetHeight);
  cc.drawImage(img, 0, 0, targetWidth, targetHeight);
}