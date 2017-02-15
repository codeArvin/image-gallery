import React, {Component} from 'react';

export default class ImageFigure extends Component {
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
