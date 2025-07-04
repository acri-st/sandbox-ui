import React, { useEffect, useState } from 'react';

import './Project.css';
import { Navigation } from '../../components/Navigation/Navigation';
import { checkProjectLoopCondition } from '../../utils/projects';
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames';
import Overview from './ProjectOverview/ProjectOverview';
import Settings from './ProjectSettings/ProjectSettings';
import { Breadcrumbs, IBreadcrumb, Loading, Logger, LoginRequired, Page, Status, getData, getProject } from "@desp-aas/desp-ui-fwk";
import { NavLink } from 'react-router-dom';
import { ProjectServerStatus } from '../../components/ProjectServerStatus/ProjectServerStatus';
import Build from './ProjectBuild/ProjectBuild';
import VirtualMachine from './ProjectVirtualMachine/VirtualMachine';
import { ProjectAssets } from './ProjectAssets/ProjectAssets';
import { IProject } from '@desp-aas/desp-ui-fwk/src/utils/types';

const logger = new Logger("pages", "Project");

const Sections = [
    { label: <>Overview</>, path: "" },
    { label: <>Build</>, path: "build" },
    { label: <>Virtual machine</>, path: "virtual-machine" },
    // { label: <>Publish</>, path: "publish" },
    // { label: <>Monitor</>, path: "monitor" },
    { label: <>Assets</>, path: "assets" },
    { label: <>Settings</>, path: "settings" },
];

const BaseBreadcrumbs = [
    { label: "Home", path: '/' },
    { label: "Projects", path: 'projects' }
];

let fetchProjectLoop: NodeJS.Timeout|undefined;

const clearProjectLoop = () =>{
    if(fetchProjectLoop){
        clearInterval(fetchProjectLoop);
        fetchProjectLoop = undefined;
    }
}

export type IProjectSectionProps ={
    project: IProject
    reloadProject: ()=>any
}

export default function Project() {
    const [form, setForm] = useState<IProject|undefined>()

    const { projectId } = useParams() as { projectId: string };

    const [loading, setLoading] = useState(false);
    const [project, setProject] = useState<IProject>();
    const [breadcrumbs, setBreadcrumbs] = useState<IBreadcrumb[]>([
        { label: "Home", path: '/' },
        { label: "Projects", path: 'projects' },
        { label: <>{project?.name || projectId || ''} <Loading/></>, path: '' },
    ])

    const navigate = useNavigate();

    const fetchProject = async (loading?: boolean) => {
        try {
            if(loading) setLoading(true);

            let project = await getProject(projectId)
            setProject(project);

            // project.docker_image = "test1,test2"
            // project.logs = test_log;

            if(project.logs){
                // Split logs by , then parse and fuse
                let stepAndLogs: {step: string, log?:string}[] = [];
                let idx = 0;
                project.logs.split(',').forEach((log)=>{
                    let l = atob(log);
                    // console.log("GOT IN", idx)
                    if(idx % 2 === 0){
                        // STEP
                        let reg = l.match(/^\n<hr\/>\nStep: ([\d\w\.\s\-]+) |/)
                        // console.log("reg", reg)
                        stepAndLogs.push({
                            step: reg?.[1] || ''
                        })
                    }
                    else {
                        // LOG
                        let lastStep = stepAndLogs[stepAndLogs.length - 1];
                        
                        if(l.startsWith("{")) lastStep.log = JSON.stringify(JSON.parse(l), null, 4)
                        else if(l.startsWith("\n<hr/>")) lastStep.log = l.replace("\n<hr/>", "")
                        else if(l.startsWith("&lt;hr")) lastStep.log = l.replaceAll("&lt;", "<").replaceAll("&gt;", ">").replace("<hr/>", "")
                        else if(l.startsWith("&lt;")) lastStep.log = l.replaceAll("&lt;", "<").replaceAll("&gt;", ">")
                        else lastStep.log = l;                        
                    }
                    idx++;
                })

                project.logsParsed = stepAndLogs;
                // project.logsParsed = project.logs.split(',').map(()=>{})
                // console.log("stepAndLog", stepAndLogs)
            }
            else{
                // project.logs = trivyLogsExample.replaceAll("&lt;", "<").replaceAll("&gt;", ">")
            }

            setBreadcrumbs([
                { label: "Home", path: '/' },
                { label: "Projects", path: 'projects' },
                { label: <>{project.name}</>, path: '' },
            ])
        }
        catch (e) {
            logger.error("fetchProject error", e)
            navigate("/projects")
        }
        finally {
            if(loading) setLoading(false)
        }
    }

    useEffect(() => {
        fetchProject(true)
    }, [projectId])

    useEffect(()=>{
        if(
            checkProjectLoopCondition(project)
        ){
            if(!fetchProjectLoop)
                fetchProjectLoop = setInterval(()=>{ fetchProject(); }, 5000)
        }
        else{
            if(fetchProjectLoop){
                clearProjectLoop()
            }
        }

        return ()=>{
            clearProjectLoop();
        }
    }, [ project?.server?.state ])

    return (
        <Page id="project" fixedHeight>
            <Navigation />

            <LoginRequired>

                <div className="fixed-page-content">
                    
                    <div className="section no-margin-bottom">

                        <Breadcrumbs
                            breadcrumbs={breadcrumbs}
                        />
                    </div>
                    <div id="project-tabs">
                        {
                            Sections.map((t) => (
                                <NavLink
                                    key={t.path}
                                    id={`project-tab-${t.path}`}
                                    className={classNames({ "project-tab": true })}
                                    to={!loading && project ? `/projects/${project.id}${t.path ? '/' + t.path : '' }` : ''}
                                    end
                                >
                                    <div className="project-tab-label">
                                    {t.label} {t.path === 'build' && <Status status={project?.status || 'none'} iconOnly />}
                                    </div>
                                </NavLink>
                            ))
                        }
                        {
                            project &&
                            <ProjectServerStatus label project={project}/>
                        }
                    </div>
                    <div id="project-section" className="section">
                        {
                            loading 
                            ? <Loading/>
                            : 
                            project &&
                            <Routes>
                                <Route path="" element={<Overview project={project} reloadProject={fetchProject}/> }/>
                                <Route path="/build" element={<Build project={project}  reloadProject={fetchProject}/>}/>
                                <Route path="/virtual-machine" element={<VirtualMachine project={project}  reloadProject={fetchProject}/>}/>

                                {/* <Route path="/publish" element={<Publish project={project}/>}/>
                                <Route path="/monitor" element={<></>}/>*/}
                                <Route path="/assets" element={<ProjectAssets project={project} reloadProject={fetchProject}/>}/> 
                                <Route path="/settings" element={<Settings project={project} reloadProject={fetchProject}/>}/>
                                <Route path="*" element={<Navigate to={`/projects/${project.id}`} replace/>}/>
                            </Routes>
                        }
                    </div>
                </div>
            </LoginRequired>

        </Page>
    );
};
