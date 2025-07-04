import React, { useEffect, useState } from 'react';

import './Projects.css';
import { Navigation } from '../../components/Navigation/Navigation';
import HeaderBox from '../../components/HeaderBox/HeaderBox';
import { GrDocumentConfig } from "react-icons/gr";
// import projects from '../../utils/example_projects';
import { useNavigate } from 'react-router-dom';
import { Page, Status, Table, formatDate, getData, FWKIcons, LoginRequired, Logger, useUser, toast, handleRequestError, getProjects } from "@desp-aas/desp-ui-fwk";
import { checkProjectLoopCondition } from '../../utils/projects';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { ProjectServerStatus } from '../../components/ProjectServerStatus/ProjectServerStatus';
import { IProject } from '@desp-aas/desp-ui-fwk/src/utils/types';

const logger = new Logger("pages", "projects");


let fetchProjectLoop: NodeJS.Timeout|undefined;

const clearProjectLoop = () =>{
    if(fetchProjectLoop){
        clearInterval(fetchProjectLoop);
        fetchProjectLoop = undefined;
    }
}

export default function Projects() {
    const [searching, setSearching] = useState(false);
    const navigate = useNavigate()
    const [projects, setProjects] = useState<IProject[] | undefined>();

    const user = useUser();

    useEffect(() => {
        if(user){
            fetchProjects(true)
        }
    }, [ user ])

    const fetchProjects = async (withLoading?: boolean) => {
        if(withLoading) setSearching(true);
        try {
            let res = await getProjects();
            setProjects(res)
        }
        catch (e) {
            logger.error("Error while fetching projects", e);
            handleRequestError(e, { defaultMessage: <>Could not retrieve projects, pleauserSessionExpirationse try again later</> })
        }
        finally {
            if(withLoading) setSearching(false);
        }
    }


        useEffect(()=>{
            if(
                projects?.some(checkProjectLoopCondition)
            ){
                if(!fetchProjectLoop)
                    fetchProjectLoop = setInterval(()=>{ fetchProjects(); }, 5000)
            }
            else{
                if(fetchProjectLoop){
                    clearProjectLoop()
                }
            }
    
            return ()=>{
                clearProjectLoop();
            }
        }, [ projects ])
    


    return (
        <Page id="projects" fixedHeight>
            <Navigation />

            <LoginRequired>
                <div className="fixed-page-content">
                    <div id="projects-header" className="section">
                        <HeaderBox
                            breadcrumbs={[
                                { label: "Home", path: '/' },
                                { label: "Projects", path: 'projects' }
                            ]}
                        >
                            <h1>Projects</h1>
                            <div className="subtitle">
                                Create a new project or manage existing ones
                            </div>

                        </HeaderBox>
                    </div>

                    <div
                        id="create-project" className="section"
                    >
                        <NavLink 
                            className={classNames({ 
                                "button create-button": true
                            })}
                            to="/projects/create"
                            // onClick={() => navigate(`/projects/new-project`)}
                        >
                            {FWKIcons.createButton} New project
                        </NavLink>
                    </div>

                    <div id="projects-list" className="section">
                        <div id="projects-list-table">
                            {
                                projects && projects?.length === 0 
                                ?
                                <div
                                    id="list-create-new-project" 
                                >
                                    <NavLink 
                                        id="list-create-new-project-button" 
                                        className={classNames({ 
                                            "button themed medium": true, 
                                            "disabled": !(projects && projects.length <= 3) 
                                        })}
                                        to="/projects/create"
                                    >
                                        {FWKIcons.create} Create your first project
                                    </NavLink>
                                </div>
                                :
                                <Table
                                    headers={[
                                        { label: 'Name', type: 'text', field: 'name', format: (r) => <div className="project-item-value"><GrDocumentConfig /> {r.name}</div> },
                                        {
                                            label: 'Status', type: 'text', field: 'status',
                                            format: (r, ) => <><ProjectServerStatus project={r as IProject}/></>,
                                            fieldGetValue: (r) => (r as IProject).server?.state || ''
                                        },
                                        // {
                                        //     label: 'Modified ', type: 'date', field: 'modification_date',
                                        //     format: (r) => <div className="project-item-value"> {FWKIcons.edit} {formatDate(r.modificationDate, true)}</div>
                                        // },
                                        {
                                            label: 'Flavor ', type: 'text', field: 'resource',
                                            format: (r) => <div className="project-item-value"> {r.flavor.name}</div>,
                                            fieldGetValue: (r) => (r as IProject).flavor.name
                                        },
                                    ]}
                                    loading={searching}
                                    rows={projects}
                                    onRowClick={(row) => {
                                        navigate(`/projects/${row.id}/overview`)
                                        // navigate(`/projects/${row.name}/overview`)
                                    }}
                                />
                            }
                        </div>

                    </div>
                </div>
            </LoginRequired>

        </Page>
    );
};
