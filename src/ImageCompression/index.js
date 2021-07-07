

class ImageCompression {


  /**
   * 
   * @param {File} file ： input 选择的文件对象
   * @param {Object} ops : 
   * @param {Number} ops.width : 压缩后的宽度 与 height 可以二选一， 如果都填写， 可能会比例被压缩
   * @param {Number} ops.height : 压缩后的高度 
   */
  constructor(file, ops) {
    this.file = file;
    this.ops = ops;


    this.init();
  }


  init() {
    var { file } = this;


    var image = new Image();
    image.onload = (e) => {
      this.compression(image);
    }

    var reader = new FileReader();
    reader.onload = function (e) {
      console.log(e)
      var src = e?.target?.result || null;
      // @ts-ignore
      image.src = src;
    };
    reader.readAsDataURL(file);


    var canvas = document.createElement("canvas");
    var cc = canvas.getContext("2d");

    this.canvas = canvas;
    this.cc = cc;
  }


  compression(img) {

    var { canvas, cc, ops, file } = this;
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
      targetWidth = ratio * width;
      if (!ops.width) {
        targetHeight = ratio * height;
      }
    }

    console.log(targetWidth, targetHeight);

    console.log("原始尺寸：", width, height);
    console.log("压缩尺寸：", targetWidth, targetHeight);


    canvas.width = targetWidth;
    canvas.height = targetHeight;

    cc.clearRect(0, 0, targetWidth, targetHeight);
    cc.drawImage(img, 0, 0, targetWidth, targetHeight);


    canvas.toBlob(function (blob) {
      // 图片ajax上传
      console.log(blob)
    }, file.type || 'image/png');

  }


}


export default ImageCompression