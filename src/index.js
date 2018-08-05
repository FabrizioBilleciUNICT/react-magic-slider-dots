import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './react-magic-slider-dots.css';

export default class MagicSliderDots extends Component {

    constructor(props) {
        super(props);

        //init
        this.previousActiveIndex = 0;
        this.hasAnimated = false;
        this.minIndex = 0;
        this.maxIndex = 0;
    }

    render() {

        const { dots, numDotsToShow, dotWidth, dotContainerClassName, activeDotClassName, prevNextDotClassName } = this.props;

        const active = dots.find(dot => dot.props.className === activeDotClassName);
        let adjustedDots = [...dots];
        let activeIndex = parseInt(active.key);
        const isMovingForward = activeIndex > this.previousActiveIndex;

        //need to subtract 2 from numDotsToShow since array index are zero-based
        if ((activeIndex > (numDotsToShow - 2) && adjustedDots.length > numDotsToShow)
            || this.hasAnimated) {

            if (isMovingForward) {
                if (activeIndex === this.maxIndex && activeIndex !== dots.length - 1) {
                    //list will move left
                    this.minIndex = activeIndex - (numDotsToShow - 2);
                    this.maxIndex = activeIndex + 1;
                }
            } else { //movingBackwards

                if (activeIndex === this.minIndex && activeIndex !== 0) {
                    //list will move right
                    this.minIndex = activeIndex - 1;
                    this.maxIndex = this.minIndex + (numDotsToShow - 1);
                }
            }

            this.hasAnimated = true;
            const firstViewableDotIndex = this.minIndex;
            const firstViewableDot = adjustedDots[firstViewableDotIndex];
            const lastViewableDotIndex = this.maxIndex;
            const lastViewableDot = adjustedDots[lastViewableDotIndex];

            if (lastViewableDotIndex < (adjustedDots.length - 1) && isMovingForward) {
                //moving foward- but not on the last dot
                adjustedDots = [
                    ...adjustedDots.slice(0, firstViewableDotIndex),
                    React.cloneElement(firstViewableDot, { className: prevNextDotClassName }),
                    ...adjustedDots.slice(firstViewableDotIndex + 1, lastViewableDotIndex),
                    React.cloneElement(lastViewableDot, { className: prevNextDotClassName }),
                    ...adjustedDots.slice(lastViewableDotIndex + 1)];
            }
            else if (lastViewableDotIndex === (adjustedDots.length - 1)) {
                //moving foward or backward - last dot visible - should appear not small
                adjustedDots = [
                    ...adjustedDots.slice(0, firstViewableDotIndex),
                    React.cloneElement(firstViewableDot, { className: prevNextDotClassName }),
                    ...adjustedDots.slice(firstViewableDotIndex + 1)];
            }
            else if (activeIndex > 1 && !isMovingForward) {
                //moving backwards the left
                adjustedDots = [
                    ...adjustedDots.slice(0, firstViewableDotIndex),
                    React.cloneElement(firstViewableDot, { className: prevNextDotClassName }),
                    ...adjustedDots.slice(firstViewableDotIndex + 1, lastViewableDotIndex),
                    React.cloneElement(lastViewableDot, { className: prevNextDotClassName }),
                    ...adjustedDots.slice(lastViewableDotIndex + 1)];
            }
            else {
                this.hasAnimated = false;
                //moving backwards on first dot - should appear not small
                //eq: (activeIndex === 1 || activeIndex === 0) && !isMovingForward
                adjustedDots = [
                    ...adjustedDots.slice(0, lastViewableDotIndex),
                    React.cloneElement(lastViewableDot, { className: prevNextDotClassName }),
                    ...adjustedDots.slice(lastViewableDotIndex + 1)];
            }
        }
        //no leftOffset in place, just render the dots
        else {
            const lastViewableDotIndex = Math.min(numDotsToShow, dots.length) - 1;
            this.minIndex = 0;
            this.maxIndex = lastViewableDotIndex;

            if (lastViewableDotIndex < adjustedDots.length - 1) {
                const lastViewableDot = adjustedDots[lastViewableDotIndex];

                adjustedDots = [...adjustedDots.slice(0, lastViewableDotIndex),
                React.cloneElement(lastViewableDot, { className: prevNextDotClassName }),
                ...adjustedDots.slice(lastViewableDotIndex + 1)];
            }
        }

        //track active index
        this.previousActiveIndex = activeIndex;
        //calculate container width
        const containerWidth = dots.length < numDotsToShow ? dots.length * dotWidth : numDotsToShow * dotWidth;

        const midIndex = (this.minIndex + this.maxIndex) / 2;

        //only give leftOffset if number of dots exceeds number of dots to show at one time
        const leftOffset = dots.length < numDotsToShow ?
            0 :
            (((dotWidth * numDotsToShow) - dotWidth) / 2) - (midIndex * dotWidth);

        return <div className={dotContainerClassName}
            style={{ overflow: "hidden", margin: "auto", width: containerWidth + "px" }}>
            <ul style={{ left: leftOffset + "px" }}> {adjustedDots} </ul>
        </div>
    }
}

MagicSliderDots.propTypes = {
    dots: PropTypes.array.isRequired,
    numDotsToShow: PropTypes.number.isRequired,
    dotWidth: PropTypes.number.isRequired,
    dotContainerClassName: PropTypes.string,
    activeDotClassName: PropTypes.string,
    prevNextDotClassName: PropTypes.string
}

MagicSliderDots.defaultProps = {
    dotContainerClassName: "magic-dots slick-dots",
    activeDotClassName: "slick-active",
    prevNextDotClassName: "small"
};