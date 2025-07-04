import React, { ReactNode, useEffect, useState } from 'react';
import '@desp-aas/desp-ui-fwk';
import './theme/app.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import { ReduxState } from './redux';
import { useDispatch, useSelector } from 'react-redux';
import Projects from './pages/Projects/Projects';
import UserGuides from './pages/UserGuides/UserGuides';
import CreateProject from './pages/CreateProject/CreateProject';
import Project from './pages/Project/Project';
import { appInit, getGUILink, LoadingPage, NavigationMobileMenu } from '@desp-aas/desp-ui-fwk';
import { ToastContainer } from 'react-toastify';
import { routes } from './utils/routes';
import { setProject } from './redux/projectReducer';


export default () => {
    // const auth = useSelector((state: ReduxState) => state.auth);
    const [loading, setLoading] = useState(true);
    const {authChecked} = useSelector((state: ReduxState)=> state.auth );

    const dispatch = useDispatch();
    appInit(dispatch);

    useEffect(() => {
        getGUILink()
        .then((gui_link)=> dispatch(setProject({ gui_link })) )
    }, [])

    useEffect(() => {
        if(authChecked){
            setLoading(false);
        }
    }, [authChecked])


    
    return (
        <div 
            id="app"
        >
            <ToastContainer
                position='bottom-right'
            />
            {
                loading
                    ?
                    <LoadingPage title={<>SandBox</>} />
                    :
                    <BrowserRouter>
                        <NavigationMobileMenu
                            routes={routes}
                        />
                        <Routes>
                            <Route path="/" element={<Home />} />

                            <Route path="/projects" element={<Projects />} />
                            <Route path="/projects/create" element={<CreateProject />} />
                            <Route path="/projects/:projectId/*" element={<Project />} />

                            
                            <Route path="/user-guides/:guideId?" element={<UserGuides />} />
                            {/* <Route path="/projects/:project?" element={<Support />} /> */}


                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </BrowserRouter>
            }
        </div>
    )
}