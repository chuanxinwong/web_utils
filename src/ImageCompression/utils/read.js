export default function() {
  var { imgFile } = this;

  var pros = null;
  if (imgFile instanceof HTMLImageElement) {
    pros = Promise.resolve(imgFile);
  } else if (imgFile instanceof File) {
    pros = readyImage(imgFile);
  }

  return pros;
}


/**
 * 把选择的File文件对象转换成HTMLImageElement
 * @param {File} imgFile : input 选择的File文件对象
 * @returns HTMLImageElement
 */
function readyImage(imgFile) {
  return new Promise((resolve, reject) => {
    var image = new Image();
    image.onload = (e) => {
      resolve(image);
    }
    image.onerror = (e) => {
      reject(e);
    }

    var reader = new FileReader();
    reader.onload = (e) => {
      var src = e.target.result || null;
      image.src = src;
    };

    reader.readAsDataURL(imgFile);
  })
}