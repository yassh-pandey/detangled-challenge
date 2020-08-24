import React, {useEffect, useState, useRef} from 'react'
import "../styles/TripCard.css"
import URL from "../fetchURL";
import moment from "moment"
function TripCard(props) {
    const [cardId, setCardId] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editableContent, setEditableContent] = useState(null);
    const destinationInputRef = useRef(null);
    const commentInputRef = useRef(null);
    const tripCardRef = useRef(null);
    const deleteButtonRef = useRef(null);
    const deleteConfirmationBoxRef= useRef(null);
    const tripCardWrapperRef = useRef();
    const [editActionInitiator, setEditActionInitiator] = useState(null);
    const [displayDeleteConfirmationBox, setDisplayDeleteConfirmationBox] = useState(false);
    const handleTripDestinationClick = (e)=>{
        e.preventDefault();
        setEditActionInitiator("destination");
        setEditMode(true);
    };
    const handleMouseOverDeleteButton = (e)=>{
        e.preventDefault();
        if(deleteButtonRef.current){
            tripCardRef.current.style.boxShadow = "0px 0px 10px 2px rgba(255, 0, 0, 0.4)"
        }
    };
    const handleMouseLeaveDeleteButton = (e)=>{
        e.preventDefault();
        tripCardRef.current.style.boxShadow = "0px 0px 10px -4px rgba(1,1,1,0.4)";
    };
    const handleDeleteButtonClicked = (e)=>{
        e.preventDefault();
        tripCardRef.current.removeAttribute("style");
        setEditActionInitiator(null);
        setEditMode(false);
        setDisplayDeleteConfirmationBox(true);
    };
    const cancleDeleteOperation = (e)=>{
        e.preventDefault();
        setDisplayDeleteConfirmationBox(false);
    };
    const proceedDeleteOperation = (e)=>{
        e.preventDefault();
        props.io.unobserve(tripCardWrapperRef.current);
        props.globalTripDispatch({
            type: "DELETE_TRIP",
            payload: {
                id: cardId
            }
        });
        const options = {
            method: "DELETE",
            mode: 'cors',
        };
        fetch(`${URL}/${cardId}`, options);
    };
    const handleTripDestinationChange = (e)=>{
        const target = e.currentTarget;
        setEditableContent(currentState=>{
            return {...currentState, trip_destination: target.value};
        })
    };
    const handleTripCommentChange = (e)=>{
        const target = e.currentTarget;
        setEditableContent(currentState=>{
            return {...currentState, trip_comment: target.value};
        })
    }
    const handleTripCommentClick =(e)=>{
        e.preventDefault();
        setEditActionInitiator("comment");
        setEditMode(true);
    }
    const handleDiscardEditClick =(e)=>{
        e.preventDefault();
        tripCardRef.current.removeAttribute("style");
        const currentCardInfo = props.globalTripState.data.filter(item=>item.id.toString()===cardId.toString())[0];
        setEditableContent({trip_destination: currentCardInfo.destination, trip_comment: currentCardInfo.comment})
        setEditActionInitiator(null);
        setEditMode(false);
    }
    const handleSaveChangesEditClick = (e)=>{
        e.preventDefault();
        const {id, start, duration, color} = props;
        props.globalTripDispatch({type: "SET_EDITABLE_CONTENT", payload:{
                cardId,
                content: editableContent
            } 
        });
        const requestBody = {
            id: cardId,
            destination: editableContent.trip_destination,
            start,
            duration,
            comment: editableContent.trip_comment,
            color
        };
        const options = {
            method: "PUT",
            mode: 'cors',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody) 
        };
        fetch(`${URL}/${cardId}`, options);
        setEditMode(false);
    }
    useEffect(()=>{
        if(editMode){
            if(editActionInitiator==="destination"){
                destinationInputRef.current.focus();
            }
            else if(editActionInitiator==="comment"){
                commentInputRef.current.focus();
            }
            tripCardRef.current.style.transform = "translate3d(0px, -1rem, 0)";
            tripCardRef.current.style.boxShadow = "0px 0px 20px -6px rgba(1,1,1,0.4)";
        }
        else{
            if(tripCardRef.current){
                tripCardRef.current.removeAttribute("style");
            }
        }
    },[editMode, editActionInitiator])
    useEffect(()=>{
        setCardId(props.id);
        if(tripCardWrapperRef.current){
            props.io.observe(tripCardWrapperRef.current);
        }
        const trip_destination = props.destination;
        const trip_comment = props.comment;
        if(trip_destination && trip_comment){
            setEditableContent(
                {
                    trip_destination,
                    trip_comment
                }
            );   
        }
        else{
            return ;
        }
    },[props.comment, props.destination, props.id, props.io]);

    return (
        <div className="TripCard__wrapper" ref={tripCardWrapperRef} id={cardId} >
        {
            displayDeleteConfirmationBox
            ?   
            <div className="TileCard__displayConfirmationBox"
            ref={deleteConfirmationBoxRef}
            >
                <div className="TileCard__displayConfirmationBox__title">
                    Delete trip
                </div>
                <hr />
                <div className="TileCard__displayConfirmationBox__message">
                    Are you sure you want to delete this trip?
                </div>
                <div className="TileCard__displayConfirmationBox__subMessage">
                    You won't be able to revert this action!
                </div>
                <hr />
                <div className="TileCard__displayConfirmationBox__actionButtonsWrapper">
                    <div className="confirmDeleteButton" onClick={proceedDeleteOperation}>
                        Yes, delete it!
                    </div>
                    <div className="cancelOperationButton" onClick={cancleDeleteOperation}>
                        Cancel
                    </div>
                </div>
            </div>
        :
            <div className="TripCard__container" ref={tripCardRef}>
                {
                    editMode
                    ?
                    <div className="Edit__TripCard__destination">
                        <input ref={destinationInputRef} value={editableContent.trip_destination} 
                        onChange={handleTripDestinationChange}
                        maxLength="40"
                        />
                    </div>
                    :
                    <div className="TripCard__destination" onClick={handleTripDestinationClick}>{props.destination}</div>
                }
                <div className="TripCard__startDate">
                    <span className="TripCard__itemHeader">
                        Trip starts on: 
                    </span>
                    {moment(props.start).format("DD/MM/YYYY")}
                </div>
                <div className="TripCard__duration">
                    <span className="TripCard__itemHeader"> 
                        Duration: 
                    </span>
                    {props.duration} days
                </div>
                {
                    editMode
                    ?
                        <div className="Edit__TripCard__comment">
                            <span className="TripCard__itemHeader">
                                Comment: 
                            </span>
                            <input ref={commentInputRef} value={editableContent.trip_comment} 
                            onChange={handleTripCommentChange}
                            maxLength="40"
                            />
                        </div>
                    :
                        <div className="TripCard__comment" onClick={handleTripCommentClick}>
                            <span className="TripCard__itemHeader">
                                Comment: 
                            </span>
                            <span className="TripCard__comment__valueBox" style={{border: "thin dashed #c7c7c7", 
                            padding: "0.4rem 2rem",overflow: "hidden", textOverflow: "ellipsis"}}>
                                {props.comment}
                            </span>
                        </div>
                }

                {
                    editMode
                    ?
                    (   <div className="TripCard__changesActionButton">
                            <div className="TripCard__saveChanges"
                            onClick={handleSaveChangesEditClick}
                            ><i className="material-icons" style={{marginRight: "0.4rem"}}>save_alt</i>Save changes</div>
                            <div className="TripCard__discardChanges"
                            onClick={handleDiscardEditClick}
                            ><i className="material-icons" style={{marginRight: "0.4rem"}}>cancel_presentation</i>Discard changes</div>
                        </div>
                    )
                    :
                    null
                }
                <div className="TripCard__delete" 
                ref={deleteButtonRef}
                onMouseOver={handleMouseOverDeleteButton} 
                onMouseLeave={handleMouseLeaveDeleteButton}
                onClick={handleDeleteButtonClicked}
                >
                    <i className="material-icons">delete</i>
                </div>
                {
                    props.idOfItemInViewPort && props.idOfItemInViewPort.toString()===cardId?.toString()
                    ?
                    <div className="activeCardIndicator" style={{backgroundColor: props.color}}>
                    </div>
                    :
                    null
                }
            </div>
        }
        </div>
    )
}

export default TripCard
