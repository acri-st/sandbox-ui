import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { IProjectSectionProps } from "../Project";
import { FaSyncAlt, FaTimes } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import classNames from "classnames";
import { Loading, useUser, toast, confirm, handleRequestError, deleteProject, resetServer, resumeServer, suspendServer } from "@desp-aas/desp-ui-fwk";
import { useNavigate } from "react-router-dom";
import { IoPauseOutline } from "react-icons/io5";
import { IoIosPlay } from "react-icons/io";
import './ProjectSettings.css';
import { SERVER_STATUS } from "@desp-aas/desp-ui-fwk/src/utils/types";



export default function ProjectSettings(props: IProjectSectionProps) {
    const [ resetting, setResetting ] = useState(false);
    const [ deleting, setDeleting ] = useState(false);
    const [ suspending, setSuspending ] = useState(false);
    const [ resuming, setResuming ] = useState(false);
    const [ isDisabled, setIsDisabled ] = useState(false);
    const [ operationOngoing, setOperationOngoing ] = useState(false);

    useEffect(()=>{
        setOperationOngoing(resetting || deleting || resuming || suspending)
    }, [ resetting, deleting, suspending, resuming ])

    useEffect(()=>{
        setIsDisabled(
            operationOngoing
            // || (
            //     props.project.server?.state
            //     ? [SERVER_STATUS.SUSPENDING].includes(props.project.server.state)
            //     : 
            // )
        )
    }, [ operationOngoing, props.project ])

    const user = useUser();
    const navigate = useNavigate()

    const handleResetProject = useCallback(()=>{
        if(!user || operationOngoing) return;
        if(!props.project.server?.id){
            toast(<>The server is not setup, please try again later</>, { type: 'warning' });
        }
        else{
            confirm({
                title: "Reset server",
                message: "Are you sure you want to RESET the server? You will lose all data that's inside",
                onConfirm: ()=>{
                    if(props.project.server){
                        setResetting(true);
                        resetServer(props.project.server.id)
                        .then(()=>{
                            toast(<>Successfully reset server</>, { type: 'success' })
                            setTimeout(()=>{
                                props.reloadProject()
                            }, 2000)
                        })
                        .catch((e)=>{
                            handleRequestError(e as any,
                                { defaultMessage: "An error has occured during server reset, please try again later" }
                            )
                        })
                        .finally(()=>{
                            setResetting(false);
                        })
                    }
                }
            })
        }
    }, [ props.project, operationOngoing ]);

    
    const handleResume = useCallback(()=>{
        if(!user || operationOngoing) return;
        if(!props.project.server?.id){
            toast(<>The server is not setup, please try again later</>, { type: 'warning' });
        }
        else{
            confirm({
                title: "Resume server",
                message: "Are you sure you want to RESUME the server?",
                onConfirm: ()=>{
                    if(props.project.server){
                        setResuming(true);
                        resumeServer(props.project.server.id)
                        .then(()=>{
                            toast(<>Successfully resuming server</>, { type: 'success' })
                            props.reloadProject()
                        })
                        .catch((e)=>{
                            handleRequestError(e as any,
                                { defaultMessage: "An error has occured during server resume, please try again later" }
                            )
                        })
                        .finally(()=>{
                            setResuming(false);
                        })
                    }
                }
            })
        }
    }, [ props.project, operationOngoing ]);

    
    const handleSuspend = useCallback(()=>{
        if(!user || operationOngoing) return;
        if(!props.project.server?.id){
            toast(<>The server is not setup, please try again later</>, { type: 'warning' });
        }
        else{
            confirm({
                title: "Suspend server",
                message: "Are you sure you want to SUSPEND the server? This will prevent you from accessing the server until resumed.",
                onConfirm: ()=>{
                    if(props.project.server){
                        setSuspending(true);
                        suspendServer(props.project.server.id)
                        .then(()=>{
                            toast(<>Successfully suspending server</>, { type: 'success' })
                            props.reloadProject()
                        })
                        .catch((e)=>{
                            handleRequestError(e as any, { defaultMessage: "An error has occured during server suspension, please try again later" })
                        })
                        .finally(()=>{
                            setSuspending(false);
                        })
                    }
                }
            })
        }
    }, [ props.project, operationOngoing ]);




    const handleDeleteProject = useCallback(()=>{
        if(!user || operationOngoing) return;
        confirm({
            title: "Delete project",
            message: `Are you sure you want to DELETE the project? You will lose all data that is inside the server and the git repository`,
            onConfirm: ()=>{
                setDeleting(true);
                deleteProject(props.project.id)
                .then(()=>{
                    toast(<>Successfully deleted project</>, { type: 'success' });
                    navigate('/projects');
                })
                .catch((e)=>{
                    handleRequestError(e as any, { defaultMessage: "An error has occured during project deletion, please try again later" })
                })
                .finally(()=>{
                    setDeleting(false);
                })
            }
        })
            
    }, [ props.project, operationOngoing ])

    return (
        <>
            <div id="settings-content" className="sub-section">
                {
                    props.project.server &&
                    <>
                        {
                            (
                                props.project.server.state === SERVER_STATUS.READY
                                || props.project.server.state === SERVER_STATUS.RESUMING
                            ) &&
                                <div className="setting-field">
                                    <div 
                                        className={classNames({ "button medium filled": true, "disabled": operationOngoing || props.project.server.state === SERVER_STATUS.RESUMING })}
                                        id="project-settings-suspend"
                                        onClick={handleSuspend}
                                    >
                                        {
                                            resetting
                                            ? <><Loading/> Suspending...</>
                                            : <><IoPauseOutline /> Suspend</>
                                        }
                                    </div>
                                    <label>Suspend the SandBox instance to stop using resources.</label>
                                </div>
                        }
                        {
                            (
                                props.project.server.state === SERVER_STATUS.SUSPENDED 
                                || props.project.server.state === SERVER_STATUS.SUSPENDING 
                            ) &&
                                <div className="setting-field">
                                    <div 
                                        className={classNames({ "button medium filled": true, "disabled": operationOngoing || props.project.server.state === SERVER_STATUS.SUSPENDING })}
                                        id="project-settings-resume"
                                        onClick={handleResume}
                                    >
                                        {
                                            resetting
                                            ? <><Loading/> Resuming...</>
                                            : <><IoIosPlay /> Resume</>
                                        }
                                    </div>
                                    <label>Resume the SandBox instance to start working.</label>
                                </div>
                        }
                        <div className="setting-field">
                            <div 
                                className={classNames({ 
                                    "button medium filled": true, 
                                    "disabled": (
                                        operationOngoing
                                        || !(
                                            [ SERVER_STATUS.READY, SERVER_STATUS.ERROR ]
                                            .includes(props.project.server.state)
                                        )
                                    )
                                })}
                                id="project-settings-reset"
                                onClick={handleResetProject}
                            >
                                {
                                    resetting
                                    ? <><Loading/> Resetting...</>
                                    : <><FaSyncAlt /> Reset</>
                                }
                            </div>
                            <label>Reset SandBox instance and restart from an empty one</label>
                        </div>
                    </>
                }
                <div className="setting-field">
                    <div 
                        className={classNames({ "button medium": true, "disabled": operationOngoing })}
                        id="project-settings-delete"
                        onClick={handleDeleteProject}
                    >
                        {
                            deleting
                            ? <><Loading/> Deleting...</>
                            : <><FaTrash /> Delete</>
                        }
                    </div>
                    <label>Permanently delete the project</label>
                    {/* <label>Permanantly delete the project <span>(project owner only)</span></label> */}
                </div>

            </div>
        </>
    )
}