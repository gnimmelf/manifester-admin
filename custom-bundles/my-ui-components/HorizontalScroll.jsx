import HorizontalScroll from 'react-scroll-horizontal';
import { Motion, spring, presets } from 'react-motion'

class MyHorizontalScroll extends HorizontalScroll {

  onScrollStart(e) {
    e.preventDefault()
    // If scrolling on x axis, change to y axis
    // Otherwise just get the y deltas
    // Basically, this for Apple mice that allow
    // horizontal scrolling by default
    var rawData = e.deltaY ? e.deltaY : e.deltaX
    var mouseY = Math.floor(rawData)

    // Bring in the existing animation values
    var animationValue            = this.state.animValues
    var newAnimationValue         = (animationValue + mouseY)
    var newAnimationValueNegative = (animationValue - mouseY)

    if (!this.caniscroll()) {
      return
    }

    var scrolling = () => {
      this.props.reverseScroll
        ?  this.setState({ animValues: newAnimationValueNegative })
        :  this.setState({ animValues: newAnimationValue })
    }

    // Begin Scrolling Animation
    requestAnimationFrame(scrolling)
  }

  render() {

    const { config, style, width, height, bar } = this.props
    const springConfig = config ? config : presets.noWobble

    // Styles
    const styles = {
      height: height ? height : `100%`,
      width: width ? width : `100%`,
      overflow: `hidden`,
      position: `relative`,
      overflowX: bar ? 'scroll' : 'hidden',
      ...styles
    }

    return (
      <div
        onWheel={ this.onScrollStart }
        ref={ r => { this.hScrollParent = r }}
        style={ styles }
        className={`scroll-horizontal ${this.props.className || ''}`}>

        <Motion style={ { z: spring(this.state.animValues, springConfig) } }>
          { ({z}) => {
              const scrollingElementStyles = {
                transform: `translate3d(${z}px, 0,0)`,
                display: `inline-flex`,
                height: `100%`,
                position: `absolute`,
                willChange:`transform`
              }

              return (
                <div style={ scrollingElementStyles }>
                  { this.props.children }
                </div>
              )
            } }
        </Motion>
      </div>
    )
  }

}

export default MyHorizontalScroll;