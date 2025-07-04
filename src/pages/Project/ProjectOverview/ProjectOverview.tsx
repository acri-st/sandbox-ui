import { FaLinux, FaWindows } from "react-icons/fa";
import { IProjectSectionProps } from "../Project";
import { icons } from "../../../utils/icons";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { CopyButton, Tabs, useUser } from "@desp-aas/desp-ui-fwk";
import { CopyBlock, tomorrowNightBlue } from "react-code-blocks";
import { DockerImages,useProjectGitTokenURL } from "../../../utils/projects";
import { getOS } from "../../../utils/tools";
import { setSandboxPreferences } from "../../../redux/sandboxPreferencesReducer";
import { useDispatch, useSelector } from "react-redux";
import { ReduxState } from "../../../redux";
import { useProjectGitURL } from "../../../utils/projects";
import { Events } from "../../../components/Events/Events";
import { GUIInfo } from "../GUIInfo";
import { IProject } from "@desp-aas/desp-ui-fwk/src/utils/types";
import './ProjectOverview.css';


const Code = (props: { text: string }) =>(
    <CopyBlock
        theme={tomorrowNightBlue}
        showLineNumbers
        language={"bash"} 
        text={props.text}
    />
)

export default function Overview(props: IProjectSectionProps) {

    const user = useUser();
    
    const gitUrl = useProjectGitURL(props.project);
    const gitTokenUrl = useProjectGitTokenURL(props.project);

    return (
        <div id="overview-content" className="project-section-content">
            <div id="overview-left-side" className="project-section-left-side">
                {/* <div className="sub-section">
                    <div id="overview-alerts">
                        <FaQuestionCircle /> Alerts could not be loaded
                    </div>
                </div> */}
                <div className="sub-section">
                    <div className="sub-section-content">
                        <div className="form">

                            <div className="form-field horizontal">
                                <label>Git Repository:</label>
                                <div className="form-field-value-with-operations">
                                    <input type="text" readOnly defaultValue={gitUrl} />
                                    <div className="form-field-value-operations">
                                        <a
                                            id="open-project-git"
                                            className="button open-link inverted"
                                            href={gitUrl}
                                            target="_blank"
                                        >
                                            { icons.gitLink } Open git link
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="form-field horizontal">
                                <label>Clone Repository:</label>
                                <div className="form-field-value">
                                    <input type="text" readOnly defaultValue={gitTokenUrl} />
                                    {
                                        gitTokenUrl &&
                                        <CopyButton text={gitTokenUrl} />
                                    }
                                </div>
                            </div>

                            <DockerImages project={props.project}/>

                            <div className="form-field public-ip horizontal">
                                <label>Public IP:</label>
                                <div className="form-field-value">
                                    <input type="text" readOnly placeholder="Generating..." defaultValue={props.project.server?.public_ip || ''} />
                                    {
                                        props.project.server?.public_ip &&
                                        <CopyButton text={props.project.server.public_ip} />
                                    }
                                </div>
                            </div>

                            {
                                props.project.server?.public_ip &&
                                <>
                                    <div className="form-field quick-connect horizontal">
                                        <label>Quick connect: </label>
                                        <div className="form-field-value column">
                                            <p>
                                                Connect with the following:
                                            </p>
                                            <ConnectProject project={props.project}/>
                                        </div>
                                    </div>
                                </>
                            }
                            <GUIInfo project={props.project}/>

                        </div>
                    </div>
                </div>
            </div>

            <div id="overview-right-side" className="project-section-right-side">
                <div className="sub-section">
                    <Events project={props.project}/>
                </div>
            </div>

        </div>
    )
}
type IConnectionScript = {
    label: ReactNode,
    value: string
}
type IConnectOption = {
    label: ReactNode
    scripts: {[console_type: string]: IConnectionScript}
}

export const ConnectProject = (props: { project: IProject }) =>{
    // const [ OS, setOS ] = useState<string|undefined>();
    // const [ option, setOption ] = useState<string|undefined>();

    const dispatch = useDispatch();
    const { browser_os, browser_console } = useSelector((state: ReduxState)=> state.sandbox_preferences);

    
    const user = useUser();
    const getOptions = useCallback(() =>({
        'linux': {
            label: <><FaLinux/> Linux</>,
            scripts: {
                'console': {
                    label: 'Console',
                    value: `ssh ${user?.username}@${props.project.server?.public_ip} -i ~/.ssh/desp_id_rsa`
                },
            },
        },
        'windows': {
            label: <><FaWindows/> Windows</>,
            scripts: {
                'powershell':{
                    label: 'Powershell',
                    value: `ssh ${user?.username}@${props.project.server?.public_ip} -i $HOME\\.ssh\\desp_id_rsa`
                },
                'wsl-git_bash':{
                    label: 'WSL or Git Bash',
                    value: `ssh ${user?.username}@${props.project.server?.public_ip} -i ~/.ssh/desp_id_rsa`
                },
                'command-prompt':{
                    label: 'Command prompt',
                    value: `ssh ${user?.username}@${props.project.server?.public_ip} -i %homedrive%%homepath%\\.ssh\\desp_id_rsa`
                },
            },
        },
        // 'macos': {
        //     label: <><FaApple /> MacOS</>,
        //     scripts: {
        //         'console': {
        //             label: 'Console',
        //             value: `ssh ${user?.username}@${props.project.server?.public_ip} -i ~/.ssh/desp_id_rsa`
        //         },
        //     },
        // }
    }), [ props.project.server, user ])

    const [ options, setOptions ] = useState<{[os:string]: IConnectOption}>();


    useEffect(()=>{
        setOptions(getOptions());
    }, [ getOptions, props.project.server, user ])

    useEffect(()=>{
        if(options){
            let os;
            if(browser_os && browser_os in options){
                os =  browser_os;
            }
            else{
                switch(getOS()){
                    case 'windows': os ='windows'; break;
                    case 'linux': os ='linux';  break;
                    // case 'macos': os = 'macos';  break;
                    default: os = 'linux'; break;
                }
            }
    
            let _console: string;
            if(browser_console && os in options && browser_console in options[os].scripts){
                _console = browser_console;
            }
            else{
                _console =  Object.keys(options[os].scripts)[0];
            }
    
            dispatch(setSandboxPreferences({ 
                browser_os: os,
                browser_console: _console
            }));
        }
    }, [options])

    if(!props.project.server) return null;

    return (
        <>
            <Code text={`ssh ${user?.username}@${props.project.server?.public_ip}`}/>
            <p>Or with the specified private key to use:</p>
            {
                options &&
                <Tabs
                    tabs={Object.entries(options).map(([os_id, os], idx)=>({
                        label: os.label,
                        path: os_id
                    }))}
                    onSelect={(os_id)=>{
                        // setOS(parseInt(os)); 
                        // setOption(0);

                        dispatch(setSandboxPreferences({ 
                            browser_os: os_id,
                            browser_console: Object.keys(options[os_id].scripts)[0] 
                        }));

                    }}
                    selected={browser_os}
                />
            }

            {
                options &&
                browser_os && 
                options[browser_os]?.scripts &&
                Object.keys(options[browser_os].scripts).length > 1 &&
                <Tabs
                    tabs={Object.entries(options[browser_os].scripts).map(([browser_console, script], idx)=>({
                        label: script.label,
                        path: browser_console
                    }))}
                    onSelect={(browser_console)=>{
                        dispatch(setSandboxPreferences({ 
                            browser_console
                        }));
                    }}
                    selected={browser_console}
                />
            }

            {
                options &&
                browser_os && 
                browser_console &&
                options[browser_os]?.scripts &&
                <Code text={options[browser_os].scripts[browser_console].value}/>
            }
            <ul>
                <li>-i {"<path>"}: The path of the private key to use</li>
            </ul>
        
        </>
    )
}