class Drawing {

  /**
   * 
   * @param {Object} config 
   * @param {Element} config.el
   * @param {Int} config.petal
   */
  constructor(config) {
    this.config = config;
    console.log(config)

    this.centerPoint = [];

    this.init();
    this.range();
    this.bindEventMouse();
  }

  init(obj) {
    var { el } = this.config;
    var { clientWidth, clientHeight } = el;

    var canvas = document.createElement("canvas");
    var cc = canvas.getContext("2d");

    canvas.width = clientWidth;
    canvas.height = clientHeight;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    el.appendChild(canvas);

    cc.imageSmoothingEnabled = true;
    cc.strokeStyle = "#333";
    cc.lineWidth = 3;
    cc.lineCap = "round";
    cc.shadowOffsetX = 0;
    cc.shadowOffsetY = 0;
    cc.shadowBlur = 0;
    cc.shadowColor = "#000"

    cc.translate(0.5, 0.5);

    cc.clearRect(0, 0, canvas.width, canvas.height);
    this.cc = cc;
    this.canvas = canvas;
    this.centerPoint = [clientWidth / 2, clientHeight / 2];
  }


  bindEventMouse() {
    var cc = this;
    var { cc, canvas } = this;
    var { el } = this.config;

    var isDown = false;
    var bezierPoint = [];
    var idx = 0;

    var beginPoint = [];

    //开始绘制
    canvas.addEventListener("mousedown", (e) => {
      var { cc } = this;

      var { el } = this.config;
      var { clientWidth, clientHeight } = el;

      isDown = true;
      var { offsetX, offsetY } = e;

      var dx = (offsetX - 0);
      var dy = (offsetY - 0);
      var point = [dx, dy];

      beginPoint = point
      bezierPoint.push(point);
      bezierPoint.push(point);
      bezierPoint.push(point);
    }, false);
    //绘制中
    canvas.addEventListener("mousemove", (e) => {
      idx++;
      if (isDown && idx % 5 == 0) {
        var { cc } = this;
        var { targetTouches } = e;
        var { offsetX, offsetY } = e;

        var dx = (offsetX - 0);
        var dy = (offsetY - 0);
        bezierPoint.push([dx, dy, idx]);

        if (bezierPoint.length >= 3) {
          bezierPoint = bezierPoint.slice(-2);
        }
        console.log(...bezierPoint)

        var [p1, p2, p3] = bezierPoint;
        // 控制点
        var controlPoint = bezierPoint[0];
        // 结束点
        var endx = (p1[0] + p2[0]) / 2;
        var endy = (p1[1] + p2[1]) / 2;
        var endPoint = [endx, endy];
        
        this.drawPetal(beginPoint, controlPoint, endPoint);
        // this.drawLine(beginPoint, controlPoint, endPoint);
        // this.drawLine2(beginPoint, controlPoint, endPoint, 90);

        beginPoint = endPoint;
      }

    }, false);
    //结束绘制
    canvas.addEventListener("mouseup", () => {
      var { cc } = this;
      isDown = false;
      cc.stroke();
      cc.closePath();
    }, false);

    el.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      e.preventDefault();
    });
    el.addEventListener("mousemove", (e) => {
      e.stopPropagation();
      e.preventDefault();
    });
    el.addEventListener("mouseup", (e) => {
      e.stopPropagation();
      e.preventDefault();
      cc.closePath();
    })

    document.addEventListener("mouseup", () => {
      var { cc } = this;
      isDown = false;
      cc.closePath();
    })
  }


  range() {
    var { cc, config } = this;
    var { clientWidth, clientHeight } = config.el;

    cc.save();
    cc.strokeStyle = "#ace"
    cc.lineWidth = 1;

    cc.moveTo(clientWidth / 2, 0);
    cc.lineTo(clientWidth / 2, clientHeight);
    cc.stroke();
    cc.closePath();

    cc.moveTo(0, clientHeight / 2);
    cc.lineTo(clientWidth, clientHeight / 2);
    cc.stroke();
    cc.closePath();

    cc.restore()

  }

  drawPetal(beginPoint, controlPoint, endPoint) {
    var { config, centerPoint } = this;
    var { petal } = config;
    for (let index = 0; index < petal; index++) {
      var angle = 360 / petal * index;
      var begin = this.tranformPoint(beginPoint, centerPoint, angle);
      var control = this.tranformPoint(controlPoint, centerPoint, angle);
      var end = this.tranformPoint(endPoint, centerPoint, angle);
      // console.log(index, angle, ":" ,begin, control, end)
      this.drawLine(begin, control, end);
    }
  }

  drawLine(beginPoint, controlPoint, endPoint) {
    var { cc } = this;
    cc.beginPath();
    cc.moveTo(beginPoint[0], beginPoint[1])
    cc.quadraticCurveTo(controlPoint[0], controlPoint[1], endPoint[0], endPoint[1]);
    cc.stroke();
    cc.closePath();
  }

  clear() {
    this.cc.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  save() {
    var { el } = this.config;
    var { clientWidth, clientHeight } = el;
    var temp = document.createElement("canvas");
    temp.style.position = "fixed";
    temp.style.top = "-10000px";
    // temp.style.backgroundColor = "rgba(0,0,0,0.2)";
    temp.width = clientHeight;
    temp.height = clientWidth;
    document.body.appendChild(temp);

    var tcc = temp.getContext("2d");
    tcc.translate(0, tcc.canvas.height);
    tcc.rotate(-Math.PI / 2);

    var img = this.canvas.toDataURL();

    var myImage = new Image();
    myImage.src = img;


    return new Promise((resolve, reject) => {
      myImage.onload = () => {
        tcc.drawImage(myImage, 0, 0);
        temp.toBlob((bold) => {
          let file = new File([bold], 'filename.png', { type: bold.type })
          console.log(file);

          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function() {
            console.log(arguments)
            console.log(reader)

            var base64 = reader.result;
            console.log(base64)

            resolve([file, base64]);

            setTimeout(() => {
              document.body.removeChild(temp);
            }, 100)
          };
        });
      }
    })
  }

  tranformPoint(mPoint, cPoint, angle) {
    var { cc } = this;
    var { cos, sin } = Math;

    var radian = Math.PI * 2 / 360 * angle;

    var [x1, y1] = mPoint;
    var [x2, y2] = cPoint;
    var newx = (x1 - x2) * cos(radian) - (y1 - y2) * sin(radian) + x2;
    var newy = (x1 - x2) * sin(radian) + (y1 - y2) * cos(radian) + y2;
    return [newx, newy]
  }
}


export default Drawing