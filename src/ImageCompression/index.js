
class ImageCompression {


  /**
   * 
   * @param {Object} ops : 
   * @param {Number} ops.width : 压缩后的宽度 与 height 可以二选一， 如果都填写， 可能会比例被压缩
   * @param {Number} ops.height : 压缩后的高度 
   */
  constructor(ops) {
    this.ops = ops;
    this.file = null;

    // 目标尺寸
    this.targetWidth = null;
    this.targetHeight = null;

    this.init();
  }


  init() {
    var canvas = document.createElement("canvas");
    var cc = canvas.getContext("2d");

    this.canvas = canvas;
    this.cc = cc;
  }



  /**
   * 
   * @param { File | HTMLImageElement} file ： input 选择的文件对象
   */
  compression(file) {
    this.file = file;

    var pros = null;
    if (file instanceof HTMLImageElement) {
      pros = this.readyImage();
    } else if (file instanceof File) {
      pros = this.readyFile();
    }

    console.log(pros)

    return pros.then(img => {
      this.calcTargetSize(img);

      var { canvas, cc } = this;
      var { canvas, cc, targetWidth, targetHeight } = this;

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      cc.clearRect(0, 0, targetWidth, targetHeight);
      cc.drawImage(img, 0, 0, targetWidth, targetHeight);
      return this;
    })
  }


  // 准备压缩 File
  readyFile() {
    var { file } = this;

    return new Promise((resolve, reject) => {
      var image = new Image();
      image.onload = (e) => {
        resolve(image);
      }

      var reader = new FileReader();
      reader.onload = function (e) {
        var src = e?.target?.result || null;
        image.src = src;
      };
      reader.readAsDataURL(file);
    })


  }

  // 准备压缩 Image
  readyImage() {
    var { file } = this;
    // this.compression(file);
    return Promise.resolve(file);
  }


  // 计算压缩后的宽高
  calcTargetSize(img) {
    var { ops } = this;
    var { width, height } = img;
    // 计算压缩后的宽高

    var targetWidth = width;
    var targetHeight = height;

    if (ops.width < width && ops.width) {
      var ratio = ops.width / width;
      targetWidth = ratio * width;
      if (!ops.height) {
        targetHeight = ratio * height;
      }
    }

    if (ops.height < height && ops.height) {
      var ratio = ops.height / height;
      targetHeight = ratio * height;
      if (!ops.width) {
        targetWidth = ratio * width;
      }
    }

    this.targetWidth = targetWidth;
    this.targetHeight = targetHeight;

    console.log("原始尺寸：", width, height);
    console.log("压缩尺寸：", targetWidth, targetHeight);
  }



  getBlob(fun) {
    var { canvas, file } = this;

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, file.type);
    });
  }


  getDataURL() {
    var { canvas, file } = this;

    return new Promise((resolve, reject) => {
      var dataurl = canvas.toDataURL(file.type);
      resolve(dataurl)
    });
  }

}


export default ImageCompression