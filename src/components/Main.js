require('normalize.css/normalize.css');
require('styles/App.scss');

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import data from '../sources/data.json';

// 处理数据
var imagesData = (function(data) {
  return data.map(function(image) {
    image.url = require('../images/' + image.fileName);
    return image;
  });
})(data);

// 随机范围取值函数

var getRangeRandom = function(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

// 随机角度生成
var getDegRandom = function() {
  return Math.floor(Math.random() * 60 - 30);
}

// 照片组件
class ImageFigure extends Component {
  handleClick(e) {

    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();

  }

  render() {
    var image = this.props.data,
        styleObj = {};

    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }

    if (this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }

    if (this.props.arrange.rotate) {
      ['Moz', 'ms', 'Webkit', ''].forEach(function(value) {
        styleObj[value + 'transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      }.bind(this));
    }

    var imgFigureClassName = 'img-figure';
        // 注意！！！！ 下面添加类名时要用空格分开
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick.bind(this)}>
        <img src={image.url} alt={image.title} />
        <figcaption>
          <h2 className="img-title">{image.title}</h2>
          <div className="img-back" onClick={this.handleClick.bind(this)}>
            <p>
              {image.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    );
  }
}

class ControllerUnit extends Component {
  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }

  }

  render() {
    var controllerUnitClassName = 'controller-unit';

    if (this.props.arrange.isCenter) {
      controllerUnitClassName += ' is-center';
      if (this.props.arrange.isInverse) {
        controllerUnitClassName += ' is-inverse';
      }
    }

    return (
      <span className={controllerUnitClassName} onClick={this.handleClick.bind(this)}></span>
    );
  }
}

// 整体组件
class App extends React.Component {

  constructor(props) {
    super(props);
    this.Constant = {
      centerPos: {
        left: 0,
        top: 0
      },
      hPosRange: {
        leftSecX: [0,0],
        rightSecX: [0,0],
        y: [0,0]
      },
      vPosRange: {
        topSecY: [0,0],
        x: [0,0]
      }
    };
    this.state = {
      imgsArrangeArr: [
        /*
        {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
        */
      ]
    }

    this.rearrange = this.rearrange.bind(this);
    this.reverse = this.reverse.bind(this);
    this.getImgInverse = this.getImgInverse.bind(this);
  }

  // 组件加载以后为图片获取其位置的范围
  componentDidMount() {

    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.floor(stageW / 2),
        halfStageH = Math.floor(stageH / 2);

    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.floor(imgW / 2),
        halfImgH = Math.floor(imgH / 2);

    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };

    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    this.Constant.vPosRange.topSecY[0] = -halfImgH;
    this.Constant.vPosRange.topSecY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
  }

  getImgInverse() {
    var inverse = [],
        imgsArrangeArr = this.state.imgsArrangeArr;
    imgsArrangeArr.forEach(function(value) {
      inverse.push(value.isInverse);
    });
    return inverse;
  }

  center(index) {
    return function() {
      this.rearrange(index);
      // var inverse = this.getImgInverse();
      // console.log(inverse);
    }.bind(this);
  }

  reverse(index) {
    return function() {
      var imgsArrangeArr = this.state.imgsArrangeArr;

      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      // var inverse = this.getImgInverse();
      // console.log(inverse);
      this.setState({
        imgsArrangeArr: imgsArrangeArr
      });
    }.bind(this);
  }

  rearrange(centerIndex) {
    var imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        imgsArrangeTopArr = [],
        topImgNum = Math.floor(Math.random() * 2),
        topImgSpliceIndex = 0,
        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

    imgsArrangeCenterArr[0].pos = Constant.centerPos;
    imgsArrangeCenterArr[0].rotate = 0;
    imgsArrangeCenterArr[0].isCenter = true;
    imgsArrangeCenterArr[0].isInverse = false;

    topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
    imgsArrangeTopArr.forEach(function(value, index) {
      imgsArrangeTopArr[index] = {
        pos: {
          left: getRangeRandom(...Constant.vPosRange.x),
          top: getRangeRandom(...Constant.vPosRange.topSecY)
        },
        rotate: getDegRandom(),
        isCenter: false,
        isInverse: false
      }
    });

    for(var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      var hPosRangeLORX = null;
      if (i < k) {
        hPosRangeLORX = Constant.hPosRange.leftSecX;
      } else {
        hPosRangeLORX = Constant.hPosRange.rightSecX;
      }

      imgsArrangeArr[i] = {
        pos: {
          left: getRangeRandom(...hPosRangeLORX),
          top: getRangeRandom(...Constant.hPosRange.y)
        },
        rotate: getDegRandom(),
        isCenter: false,
        isInverse: false
      }

    }

    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }
    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    this.setState({
      imgsArrangeArr: imgsArrangeArr
    });

  }

  render() {
    var controllerUnits = [],
        imgFigures = [];

    imagesData.forEach(function(value, index) {
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }

      imgFigures.push(<ImageFigure data={value} key={index} ref={'imgFigure' + index}
       arrange={this.state.imgsArrangeArr[index]} inverse={this.reverse(index)} center={this.center(index)} />);

      controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]}
        inverse={this.reverse(index)} center={this.center(index)} />)
    }.bind(this));
    // 注意！！！！！forEach的bind(this)是绑定在里面function的，我之前绑定在了外面

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

export default App;
