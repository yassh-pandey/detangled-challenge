import React, {useRef} from 'react'
import "../styles/RightPane.css"
import InfiniteCalendar, {
    Calendar,
    defaultMultipleDateInterpolation,
    withMultipleDates,
} from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';
const hexRgb = require('hex-rgb');
const MultipleDatesCalendar = withMultipleDates(Calendar);
function RightPane(props) {
    const {red: r, green: g, blue: b, alpha: a} = hexRgb(props.currentColor);
    const rbgString = `rgb(${r}, ${g}, ${b}, ${a})`;
    const rbgaString = `rgb(${r}, ${g}, ${b}, 0.2)`;
    const scrollToTopRef = useRef(null);
    const handleScrollToTop = (e)=>{
        e.preventDefault();
        const animation = scrollToTopRef.current.animate(
            [
                {
                    opacity: 1
                },
                {
                    opacity: 0
                }
            ],
            {
                duration: 300,
                easing: "ease-in",
                fill: "forwards"
            }
        );
        animation.onfinish = ()=>{
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    }
    return (
        <div className="RightPane__container">
            <div className="InfiniteCalander__wrapper">
            <InfiniteCalendar
                Component={MultipleDatesCalendar}
                interpolateSelection={defaultMultipleDateInterpolation}
                selected={[...props.activeDates]}
                displayOptions={{
                    showOverlay: false,
                    shouldHeaderAnimate: true,
                    showTodayHelper: false,
                    showWeekdays: true
                }}
                theme={{
                    selectionColor: props.currentColor,
                    textColor: {
                        default: '#333',
                        active: '#FFF'
                    },
                    headerColor: rbgString,
                    floatingNav: {
                        background: rbgaString,
                        color: '#FFF',
                        chevron: '#FFA726'
                    }
                }}
            />
            </div>
            {
                props.showScrollToTop
                ?
                <div 
                ref={scrollToTopRef}
                className="RightPane__showScrollToTopContainer" title="Scroll to top" onClick={handleScrollToTop}>
                    <i className="material-icons" style={{color: "white", fontSize: "2rem"}}>keyboard_arrow_up</i>
                </div>
                :
                null
            }
            <div className="RightPane__positionStickyScrollableArea">
            </div>
        </div>
    )
}

export default RightPane
