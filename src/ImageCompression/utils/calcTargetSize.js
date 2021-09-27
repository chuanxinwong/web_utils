/**
 * 返回计算后的尺寸
 * @param {*} img 
 * @param {*} ops 
 */
export default function(img, ops) {
  var iw = img.width;
  var ih = img.height;
  var { width, height, maxWidth, maxHeight } = ops;

  var arr = [];

  // 使用用户比例， 可能会没有比例约束
  if (width && height) {
    arr.push([width, height]);
  }

  // 以宽度计算
  if (width) {
    var th = width * (ih / iw);
    arr.push([width, th]);
  }
  if (maxWidth) {
    var th = maxWidth * (ih / iw);
    arr.push([maxWidth, th]);
  }

  // 以高度计算
  if (height) {
    var tw = height * (iw / ih);
    arr.push([tw, height]);
  }
  if (maxHeight) {
    var tw = maxHeight * (iw / ih);
    arr.push([tw, maxHeight]);
  }


  // 过滤
  var filtet = arr;
  if (maxWidth) {
    filtet = filtet.filter(item => {
      return item[0] <= maxWidth;
    })
  }
  if (maxHeight) {
    filtet = filtet.filter(item => {
      return item[1] <= maxHeight;
    })
  }

  // console.log(filtet)

  return filtet[0];
}