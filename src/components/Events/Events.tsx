import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import './Events.css';
import dayjs from 'dayjs';
import { sortEvents } from '../../utils/events';
import { getProjectEvents, handleRequestError } from '@desp-aas/desp-ui-fwk';
import { IEvent, IProject } from '@desp-aas/desp-ui-fwk/src/utils/types';

export type IProps = {
    project: IProject
    events?: IEvent[]
    type?: string
}

let interval: NodeJS.Timeout|undefined;


export const Events = (props: IProps) => {

    const [ loading, setLoading ] = useState(false);

    const [ events, setEvents ] = useState<IEvent[]>(props.events || []);

    useEffect(()=>{
        setEvents(props.events ? [...props.events].sort(sortEvents) : [])
    }, [ props.events ])

    const fetchEvents = useCallback((load?: boolean)=>{
        if(load) setLoading(true)
        getProjectEvents(props.project)
        .then((events)=>{
            if(props.type){
                setEvents(
                    events.filter((ev)=> ev.type.toLowerCase() === props.type?.toLowerCase() )
                    .sort(sortEvents)
                    // .reverse()
                )
            }
            else{
                setEvents(
                    events
                    .sort(sortEvents)
                )
            }
        })
        .catch(handleRequestError)
        .finally(()=>{
            if(load) setLoading(false)
        })
    }, [ props.type, props.project ]);

    useEffect(()=>{
        clearInterval(interval);
        if(!props.events){
            fetchEvents()
            interval = setInterval(()=>fetchEvents(), 2000)
            return ()=>{
                clearInterval(interval);
            }
        }

    }, [ props.events ])

    const formatDate = (d: string) => dayjs(d).format('DD/MM/YY HH:mm')

    return <div className="events">
        <div className="events-title">Recent {props.type ? props.type + ' ' : ''}events</div>
        <div className="events-list">
            {
                loading
                ?
                    <>
                        <EventItemLoading/>
                        <EventItemLoading/>
                        <EventItemLoading/>
                        <EventItemLoading/>
                        <EventItemLoading/>
                    </>
                :
                    events.length > 0
                    ?
                        events.map((ev)=>(
                            <div key={ev.id} className="event-item">
                                <div className="event-item-date">
                                    { formatDate(ev.created_at) }
                                </div>
                                {
                                    !props.type &&
                                    <div className={"event-item-type " + ev.type.toLowerCase()}>
                                        { ev.type }
                                    </div>
                                }
                                <div className={"event-item-status " + ev.status.toLowerCase()}>
                                    { ev.status }
                                </div>
                                <div className="event-item-message" title={ev.step}>
                                    { ev.step }
                                </div>
                            </div>
                        ))
                    : <div className="no-data">No events to show.</div>

            }
        </div>
    </div>
}

const EventItemLoading = () =>{
    return (
        <div className="event-item-loading loading">
            <div className="event-item-date-loading"/>
            <div className="event-item-type-loading"/>
            <div className="event-item-status-loading"/>
            <div className="event-item-message-loading"/>
        </div>
    )
}