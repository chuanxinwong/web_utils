# ImageCompression 图片尺寸压缩

## api

ImageCompression

constructor(file, ops):

file: File | HTMLImageElement , 可以实用 input file 选择文件后返回

ops: Object, 压缩配置,

ops.width: 压缩后的宽度 , 如果小于图片尺寸， 则不压缩

ops.height: 压缩后的高度, 与 width 可以二选一， 如果都填写， 可能会比例被压缩
