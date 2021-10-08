import config from "./utils/config.js";
import init from "./utils/init.js";
import read from "./utils/read.js";
import compression from "./utils/compression.js";
import calcTargetSize from "./utils/calcTargetSize.js";

class ImageCompression {

  /**
   * @param { File | HTMLImageElement} file ： input 选择的文件对象
   */
  constructor(imgFile) {
    this.imgFile = imgFile;
    this.task = null;

    init.call(this);
  }



  /**
   * 
   * @param {Object} ops : 压缩的配置
   * @param {int} ops.wdith : 宽度，可选
   * @param {int} ops.height : 高度，可选，
   * @param {int} ops.maxWdith : 最大宽度，
   * @param {int} ops.maxHeight : 最大高度
   * @param {String} ops.mime : 文件类型， image/png、image/jpeg、image/webp；
   * @param {Float} ops.quality : 图片质量； [0-1]
   * @returns Promise
   */
  compression(ops) {
    this.ops = ops;
    this.options = Object.assign({}, config, ops);

    this.task = read.call(this)
      .then((img) => {
        this.img = img;
        calcTargetSize.call(this);
      })
      .then(res => {
        compression.call(this)
      })

    return this;
  }


  getBlob(fun) {
    var { canvas, options, task } = this;
    task.then(res => {
      canvas.toBlob((blob) => {
        fun(blob);
      }, options.mime, options.quality);
    })
    return this;
  }


  getDataURL(fun) {
    var { canvas, options, task } = this;
    task.then(res => {
      var dataurl = canvas.toDataURL(options.mime, options.quality);
      fun(dataurl)
    })
    return this;
  }

  getInfo(fun) {
    this.task.then(res => {
      var { imgWidth, imgHeight, targetWH } = this;
      var mod = {
        sourceWidth: imgWidth,
        sourceHeight: imgHeight,
        targetWidth: targetWH[0],
        targetHeight: targetWH[1],
      }
      fun(mod)
    })
    return this;
  }

}


console.log(ImageCompression.prototype)


export default ImageCompression