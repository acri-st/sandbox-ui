import { useCallback, useEffect, useState } from "react";
import { IProjectSectionProps } from "../Project";

import { getProjectEvents, handleRequestError, Status } from "@desp-aas/desp-ui-fwk";
import { Events } from "../../../components/Events/Events";
import { sortEvents } from "../../../utils/events";
import { FaBan, FaCheck, FaClock, FaHourglassHalf, FaTimes } from "react-icons/fa";
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import classNames from "classnames";
import { PipelineStep, IEvent, PipelineStatus } from "@desp-aas/desp-ui-fwk/src/utils/types";
import './ProjectBuild.css';

let interval: NodeJS.Timeout|undefined;

const PipelineConfig = [
    { 
        step: PipelineStep["build"],
        // dependsOn: PipelineStep["pipeline"],
        // dependancyStatus: PipelineStatus["SUCCEEDED"],
    },
    { 
        step: PipelineStep["scan"],
        // dependsOn: PipelineStep["build"],
        // dependancyStatus: PipelineStatus["SUCCEEDED"],
    }
]

export default function ProjectBuild(props: IProjectSectionProps) {
    const [events, setEvents] = useState<IEvent[]>([]);
    const [currentPipeline, setCurrentPipeline] = useState<IEvent[]|undefined>([]);


    useEffect(()=>{
        let currentPipelineID =  events && events.length > 0 ? events[0].pipeline_id : undefined;
        if(currentPipelineID){
            let currentPipeline = events.filter((ev)=> ev.pipeline_id === currentPipelineID)
            setCurrentPipeline(currentPipeline)
        }
        else{
            setCurrentPipeline([])
        }
    }, [ events ])

    const fetchEvents = useCallback(()=>{
        // setEvents((tests as any).filter((ev:any)=> ev.type === 'pipeline' ).sort(sortEvents))

        getProjectEvents(props.project)
        .then((events)=>{
            setEvents(events.filter((ev)=> ev.type === 'pipeline' ).sort(sortEvents))
            // setEvents(tests)
        })
        .catch(handleRequestError)

    }, [ props.project ])


    useEffect(()=>{
        fetchEvents();

        interval = setInterval(()=>{
            fetchEvents();
        }, 2000)
        return ()=>{
            clearInterval(interval);
        }

    }, [])

    return (
        <>
            <div id="build-content" className="project-section-content">
                <div className="project-section-left-side">

                    <div id="build-pipeline-section">

                        <div className="sub-section">
                            {
                                currentPipeline &&
                                currentPipeline.length > 0
                                ?
                                    <div id="build-pipeline">
                                        <div id="build-pipeline-steps">
                                            {
                                                PipelineConfig.map((conf, idx)=>(
                                                    <PipelineStepComponent step={conf.step} events={currentPipeline} key={idx}/>
                                                ))
                                            }
                                        </div>
                                    </div>
                                :
                                    <div className="no-data centered-content">
                                        Pipeline has not run yet.
                                    </div>
                            }
                        </div>

                        <div className="sub-section" id="build-current-status-section">
                            <div id="build-current-status"className={props.project.status?.toLowerCase() || ''}>
                                <div id="build-current-status-title">Current status:</div>
                                <div id="build-current-status-value" >
                                    <Status status={props.project?.status || 'none'} />
                                </div>
                            </div>

                        </div>
                    </div>

                    {
                        // props.project.logs &&
                        props.project.logsParsed &&
                        <div className="sub-section" id="build-logs-section">
                            <div className="sub-section-content">
                                {
                                    props.project.logsParsed.map((step)=>(
                                        <div className="build-logs-container">
                                            
                                            <div className="build-logs-title">
                                                {
                                                    // l.startsWith("<") ?
                                                    //     "Trivy Report"
                                                    //     :
                                                        "Logs"
                                                }
                                                <div className="build-logs-step">
                                                    { step.step }
                                                </div>
                                            </div>
                                            
                                            <div 
                                                id="build-logs"
                                                className={classNames({
                                                    "build-logs-html": step.log?.startsWith("<"),
                                                    "build-logs-text": !step.log?.startsWith("<")
                                                })}
                                            >
                                                {
                                                    !step.log?.startsWith("<")
                                                    ? step.log
                                                    :
                                                        <>
                                                            {
                                                                parse(DOMPurify.sanitize(
                                                                    step.log, {
                                                                        WHOLE_DOCUMENT: true,
                                                                        ALLOWED_TAGS: [ 'style' ]
                                                                        // FORBID_TAGS: [ 'html' ]
                                                                    }
                                                                ))
                                                            }
                                                            {
                                                                parse(DOMPurify.sanitize(
                                                                    step.log, {
                                                                        // WHOLE_DOCUMENT: true
                                                                    }
                                                                ))
                                                            }
                                                        </>
                                                }
                                            </div>
                                        </div>

                                    ))
                                }
                            </div>
                        </div>
                    }
                </div>

                <div className="project-section-right-side">
                    <div className="sub-section">
                        <Events events={events} project={props.project} type="pipeline"/>
                    </div>
                </div>

            </div>
        </>
    )
}


const PipelineStatusIcon = (props: { status: PipelineStatus }) =>{
    if(props.status === PipelineStatus.STARTED) 
        return <FaClock />
    
    if(props.status === PipelineStatus.CANCELED) 
        return <FaBan/>
    
    if(props.status === PipelineStatus.PENDING) 
        return <FaHourglassHalf />
    
    if(props.status === PipelineStatus.FAILED) 
        return <FaTimes />
    
    if(props.status === PipelineStatus.SUCCEEDED) 
        return <FaCheck /> 
}


const PipelineStepComponent = (props: {
    events?: IEvent[]
    step: PipelineStep
}) =>{

    const [ stepEvents, setStepEvents ] = useState<{ [stepJob:string]:IEvent[] }|undefined>();
    const [ stepStatus, setStepStatus ] = useState<PipelineStatus|undefined>();
    const [ open, setOpen ] = useState(false);

    useEffect(()=>{
        let stepEventsObject:{[stepJob:string]:IEvent[]} = {};
        if(props.events)
            for(let ev of props.events?.filter((ev)=> ev.step.split(' ')[0] === props.step )){
                if(!(ev.step in stepEventsObject)){
                    stepEventsObject[ev.step] = [ev]
                }
                else{
                    stepEventsObject[ev.step].push(ev)
                }
            }
        setStepEvents(stepEventsObject)
    }, [ props.events, props.step ])

    useEffect(()=>{
        let pipelineStatus = props.events?.find((ev)=> ev.step === 'pipeline' && [PipelineStatus.FAILED, PipelineStatus.SUCCEEDED].includes(ev.status)  );

        let status: PipelineStatus = PipelineStatus.PENDING;


        let stepEventEntries = stepEvents ? Object.entries(stepEvents) : undefined;

        if(!stepEventEntries || stepEventEntries.length === 0){
            // No status so if still running then pending otherwise canceled
            if(pipelineStatus){
                status = PipelineStatus.CANCELED;
            }
        }
        else{
            if(
                stepEventEntries.some((events)=> events[1].find((ev)=>ev.status === PipelineStatus.FAILED  ) )
            ){
                status = PipelineStatus.FAILED
            }
            else if(
                stepEventEntries.every((events)=> events[1].find((ev)=>ev.status === PipelineStatus.SUCCEEDED  ) )
            ){
                status = PipelineStatus.SUCCEEDED
            }
            else if(
                stepEventEntries.some((events)=> events[1].find((ev)=> ev.status === PipelineStatus.STARTED  ) )
            ){
                status = PipelineStatus.STARTED
            }
        }

        setStepStatus(status)
        
    }, [ stepEvents ])
     
    return (
        <div className="build-pipeline-step">
            <div className="build-pipeline-step-name">
                { props.step }
            </div>
            <div 
                className={"build-pipeline-step-status " + stepStatus?.toLocaleLowerCase() || ''}
                onClick={()=>setOpen(!open)}    
            >
                {
                    stepStatus &&
                    <PipelineStatusIcon status={stepStatus}/>
                }
            </div>

            
            <div className={classNames({
                "step-status-jobs": true,
                "open": open
            })}>
                {
                    stepEvents &&
                    Object.entries(stepEvents).map(([jobName, jobEvents])=>(
                        <StepJob events={jobEvents} name={jobName} key={jobName}/>
                    ))
                }
            </div>
            
        </div>
    )
}

const StepJob = (props: {
    events: IEvent[]
    name: string
}) =>{
    const [ status, setStatus ] = useState<PipelineStatus|undefined>();

    useEffect(()=>{
        let status: PipelineStatus = PipelineStatus.PENDING;

        if(
            props.events.some((ev)=>ev.status === PipelineStatus.FAILED  )
        ){
            status = PipelineStatus.FAILED
        }
        else if(
            props.events.some((ev)=>ev.status === PipelineStatus.SUCCEEDED  )
        ){
            status = PipelineStatus.SUCCEEDED
        }
        else if(
            props.events.some((ev)=>ev.status === PipelineStatus.STARTED  )
        ){
            status = PipelineStatus.STARTED
        }

        setStatus(status)
        
    }, [ props.events ])

    return (
        <div className="step-status-job">
            <div className={`step-status-job-status ${status?.toLocaleLowerCase() || ''}`}>
                {
                    status &&
                    <PipelineStatusIcon status={status}/>
                }
            </div>
            <div className="step-status-job-name">
                { props.name }
            </div>
        </div>
    )
}