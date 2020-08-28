import React, {useEffect, useReducer, useRef, useState} from 'react'
import '../styles/LeftPane.css'
import URL from '../fetchURL'
import Loader from './Loader'
import TripCard from './TripCard'
import moment from 'moment';
import referenceDate from "../referenceDate"
const itemsPerLazyLoad = 10;
const reducer = (state, action)=>{
    let newData = [];
    let newAllData = [];
    switch (action.type){
        case "INIT_STATE":
            return {...state, allData: [...state.allData, ...action.payload.allData], isLoaded: action.payload.isLoaded, 
                startIndex: action.payload.startIndex, data: [...state.data, ...action.payload.data]};
        case "APPEND_TO_TRIPS":
            return {...state, data: [...state.data, ...action.payload.data], startIndex: action.payload.startIndex};
        case "SET_EDITABLE_CONTENT":
            newData = state.data.map(item=>{
                    if(item.id.toString()===action.payload.cardId.toString()){
                        return {...item, destination: action.payload.content.trip_destination, comment: action.payload.content.trip_comment};
                    }
                    else{
                        return item;
                    }
                });
            return {...state, data: newData};
        case "DELETE_TRIP":
            newData = state.data.filter(item=>item.id.toString()!==action.payload.id.toString())
            newAllData = state.allData.filter(item=>item.id.toString()!==action.payload.id.toString());
            return {...state, data: [...newData], allData: [...newAllData]};
        default:
            return state;
    }
}
const initialState = {
    data: [],
    isLoaded: false,
    allData: [],
    startIndex: 0
}
function LeftPane(props) {
    const {setActiveDates, setCurrentColor} = props;
    const [state, dispatch] = useReducer(reducer, initialState);
    const [idOfItemInViewPort, setIdOfItemInViewPort] = useState(null);
    const [loadMore, setLoadMore] = useState(false);
    const [scrollToViewId, setScrollToViewId] = useState(null);
    const loadMoreObserver = useRef(
        new IntersectionObserver(
            (entries=>{
                const loadMoreElement = entries[0];
                if (loadMoreElement.isIntersecting){
                    if(state.startIndex>=state.allData.length){
                        setLoadMore(false);
                        return;
                    }
                    setLoadMore(true);
                }
                else{
                    setLoadMore(false);
                }
            }),
            {
                rootMargin: "0px 0px 200px 0px"
            }
        )
    ).current;
    const observer = useRef(
        new IntersectionObserver(
            (entries, observer)=>{
                entries.forEach(entry=>{
                    if(entry.isIntersecting){
                        setIdOfItemInViewPort(entry.target.id);
                        if(window.scrollY > 1000){                  
                            props.setShowScrollToTop(true);   
                        }
                        else{
                            props.setShowScrollToTop(false);
                        }
                    }
                    else{
    
                    }
                });
            },
            {
                rootMargin: "0px 0px 0px 0px",
                threshold: 1
            }
        )
    ).current;
    const loadMoreRef = useRef(null);
    useEffect(()=>{
        if(loadMore){
            const data = state.allData.slice(state.startIndex, state.startIndex + itemsPerLazyLoad);
            const startIndex = state.startIndex + itemsPerLazyLoad;
            dispatch({type: "APPEND_TO_TRIPS", payload: {
                data, 
                startIndex
            }});
        }
    }, [loadMore])
    useEffect(()=>{
        fetch(URL)
        .then(response=>response.json())
        .then(result=>{
            const dateCompareFunction = (first, second)=>{
                return moment(first.start) - moment(second.start);
            };
            result.sort(dateCompareFunction);
            const nextDatesAfterReference = [];
            for(let i = 0 ; i < result.length ; i++){
                const item = result[i];
                const startDate = moment(item.start);
                const endDate = moment(item.start).add(item.duration, "days");
                if(startDate.isSameOrAfter(referenceDate)){
                    nextDatesAfterReference.push(item);
                }
                if( referenceDate.isSameOrAfter(startDate) && referenceDate.isSameOrBefore(endDate) ){
                    setScrollToViewId(item.id.toString()); 
                    break;
                }
            }
            
            if(nextDatesAfterReference.length !== 0){
                setScrollToViewId(nextDatesAfterReference[0].id.toString());
            }
            
            dispatch({type: "INIT_STATE", payload: {
                    allData: [...result],
                    isLoaded: true,
                    data: [...result],
                    startIndex: result.length
                }
            })
        })
    }, [dispatch])
    useEffect(()=>{
        if(loadMoreRef.current && state.isLoaded){
            loadMoreObserver.observe(loadMoreRef.current);
        }
    })
    useEffect(()=>{
        if(idOfItemInViewPort){
            if(state.isLoaded){
                const itemInViewPort = state.data.find(item=>item.id.toString()===idOfItemInViewPort.toString());
                const momentDateArray = [];
                const startDate = moment(itemInViewPort?.start).toDate();
                const tripDuration = parseInt(itemInViewPort?.duration);
                for(let i = 0; i < tripDuration; i++){
                    const date = moment(startDate).add(i, "d");
                    momentDateArray.push(date.toDate());
                }
                setActiveDates(momentDateArray);
                setCurrentColor(itemInViewPort?.color);
            }
        }
    }, [idOfItemInViewPort, state.isLoaded, setActiveDates, setCurrentColor])
    return (
        state.isLoaded
        ?
            <div className="LeftPane__container">
                {
                    
                    state.data.map(
                        (trip, index)=>(
                            scrollToViewId !== null && scrollToViewId === trip.id.toString()
                            ?
                            <TripCard 
                            idOfItemInViewPort={idOfItemInViewPort}
                            scrollToView={true}
                            io={observer} {...trip} key={trip.id} globalTripState={state} globalTripDispatch={dispatch}/>
                            :
                            <TripCard 
                            idOfItemInViewPort={idOfItemInViewPort}
                            scrollToView = {false}
                            io={observer} {...trip} key={trip.id} globalTripState={state} globalTripDispatch={dispatch}/>
                        )
                    )
                }
                <div ref={loadMoreRef} className="LeftPane__loadMoreIndicator">
                </div>
            </div>
        :
        <Loader />
    )
}

export default LeftPane
