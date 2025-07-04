import React, { ReactNode, useEffect, useRef, useState } from 'react';

import './UserGuides.css';
import { Navigation } from '../../components/Navigation/Navigation';
import HeaderBox from '../../components/HeaderBox/HeaderBox';
import tempcontent from './tempcontent';
import { ImMinus, ImPlus } from "react-icons/im";
import classNames from 'classnames';
import { useNavigate, useParams } from 'react-router-dom';
import { Page } from "@desp-aas/desp-ui-fwk";
import { guide_project_ssh } from './guides/projects/guide_project_ssh';

export type IGuide = {
    id: string
    title: string
    category: string
    content: ReactNode
}

const tempGuide = (category:string, title:string, id: string): IGuide=>{
    return { id, title, category, content: tempcontent }
}

const guides = [
    guide_project_ssh,
    // tempGuide('overview', 'About the SandBox', 'about-the-sandbox'),
    // tempGuide('overview', 'Environment architecture', 'environment-architecture'),

    // tempGuide('assets', 'Getting started with the SandBox', 'getting-started-with-the-sandbox'),
    // tempGuide('assets', 'Technical requirements and specifications', 'technical-requirements-and-specifications'),
    // tempGuide('assets', 'Implementaire timeline', 'implementaire-timeline'),
    // tempGuide('assets', 'Technology development stack', 'technology-development-stack'),
    // tempGuide('assets', 'Relevant upstream dependencies', 'relevant-upstream-dependencies'),
    // tempGuide('assets', 'API descriptions', 'api-descriptions'),

    // tempGuide('code snippets', 'Jupyter Lab snippet', 'jupyter-Lab-snippet'),

    // tempGuide('appendix', 'Frequently asked questions', 'frequently-asked-questions'),
    // tempGuide('appendix', 'SandBox Glossary', 'sandbox-glossary'),

    // tempGuide('collaborative assets', 'Collaborative Asset 1', 'collaborative-asset-1'),

]


type ISortedGuides = {
    [category: string]: IGuide[]
}

export default function UserGuides() {

    const [ sortedGuides, setSortedGuides ] = useState<ISortedGuides>()
    const [ selectedGuide, setSelectedGuide ] = useState<IGuide>(guides[0])
    const { guideId } = useParams();
    const navigate = useNavigate();


    useEffect(()=>{
        let guide = guides.find((g)=> g.id === guideId )
        if(guide){
            setSelectedGuide(guide);
        }
        else{
            navigate(`/user-guides/${guides[0].id}`)
        }
    }, [ guideId ])

    useEffect(()=>{
        formatGuides()
    }, [])

    const [ breadcrumbs, setBreadcrumbs ] = useState([
        { label: "Home", path: '/' },
        { label: "User guides", path: 'user-guides' }
    ])
    
    // After a search or an API request
    const formatGuides = () =>{
        let sortedGuides: ISortedGuides = {};
        for(let guide of guides){
            if(guide.category in sortedGuides){
                sortedGuides[guide.category].push(guide);
            }
            else{
                sortedGuides[guide.category] = [guide];
            }
        }

        setSortedGuides(sortedGuides)
    }


    return (
        <Page id="user-guides-page" fixedHeight>
            <Navigation />

            <div className="fixed-page-content">
            {/* <div className="fixed-page-content"> */}
                <HeaderBox
                    breadcrumbs={breadcrumbs}
                >
                    <h1>User <span>Guides</span></h1>
                </HeaderBox>

                <div id="user-guides" className="section">

                    <div id="user-guides-menu" className="sub-section ">
                        <div className="user-guides-menu-content scrollbar">
                            {
                                sortedGuides &&
                                Object.entries(sortedGuides).map(([category, guides])=>(
                                    <GuideCategory selectedGuide={selectedGuide} key={category} category={category} guides={guides}/>
                                ))
                            }
                        </div>
                    </div>

                    <div id="user-guides-content" className="sub-section">
                        <div className="user-guides-content-title">
                            {
                                selectedGuide?.title
                            }
                        </div>
                        <div className="user-guides-content-container scrollbar">
                            {
                                selectedGuide?.content
                            }
                        </div>
                    </div>

                </div>
            </div>

        </Page>
    );
};

type IGuideCategoryProps = {
    category: string
    guides: IGuide[]
    selectedGuide?: IGuide
}
function GuideCategory(props: IGuideCategoryProps){
    const [ open, setOpen ] = useState(true);
    const ref = useRef<any>()
    const navigate = useNavigate();

    return (
        <div className="user-guide-category">
            <div
                className="user-guide-category-toggle"
                onClick={()=> setOpen(!open) }
            >
                <div className="user-guide-category-toggle-icon">
                    {
                        open
                        ? <ImMinus/>
                        : <ImPlus/>
                    }                   
                </div>
                <label>
                    { props.category }
                </label>
            </div>
            <div 
                ref={ref}
                className={classNames({ "user-guide-category-list": true, open })}
                style={{
                    maxHeight: open ? ref.current?.scrollHeight : 0,
                }}
            >
                {
                    props.guides.map((g, gIdx)=>(
                        <div 
                            className={classNames({ "user-guide-menu-item": true, "selected": props.selectedGuide && props.selectedGuide.id === g.id })} key={g.id}
                            onClick={()=>{
                                navigate(`/user-guides/${g.id}`)
                            }}
                        >
                            { g.title }
                        </div>
                    ))
                }
            </div>

        </div>
    )
}
