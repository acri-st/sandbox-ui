import React, { useState } from 'react';
import './Home.css';
import { Navigation } from '../../components/Navigation/Navigation';
import { Page } from "@desp-aas/desp-ui-fwk";
import bannerBackground from './banner.jpeg';
import { LuHammer } from "react-icons/lu";
import { TbDeviceDesktopCog } from "react-icons/tb";
import { RiFlowChart } from "react-icons/ri";
import { FaLaptopCode } from "react-icons/fa6";
import { NavLink } from 'react-router-dom';
import { FaUsers } from "react-icons/fa6";
import { ImCogs } from "react-icons/im";
import { IoHardwareChipSharp } from "react-icons/io5";
import { FaToolbox } from "react-icons/fa6";


export default () => {
    return <Page id="home-page">
        <Navigation />
        <div id="home-banner"
            style={{ backgroundImage: `url(${bannerBackground})` }}
        >

            <div id="home-banner-title-container">
                
                <div id="home-banner-title">
                    Sandbox <span className='home-highlight-1'>services</span>
                </div>
                <div id="home-banner-subtitle">
                    Innovate, Develop, and Integrate with Ease
                </div>
            </div>

            <div id="home-banner-gradient"/>
        </div>

        <div id="home-introduction-section" className="section-container">
            <div className="home-section-background"/>
            <div className="home-section-transition-bottom"/>
            <div className="section padding">
                <div id="home-introduction-text" className="home-large-text">
                    Step into the Sandbox, your dedicated development environment designed to unlock innovation and streamline application creation.
                </div>               
            </div>
        </div>

        <div id="home-highlights-section" className="section-container">
            <div className="section padding">
                <div id="home-highlights-container">
                    <div id="home-subtext" className="home-section-text">
                        As part of a powerful platform centralising remote sensing data, forecasts, and more, that is the Destination Earth Core Platform, the Sandbox empowers you to
                    </div>

                    <div id="home-highlights">
                        {
                            [
                                {
                                    icon: <LuHammer/>,
                                    title: "Build New Applications",
                                    text: "Harness cutting-edge tools and datasets to design and develop groundbreaking applications in a fully integrated environment."
                                },
                                {
                                    icon: <TbDeviceDesktopCog/>,
                                    title: "Simulate Real-world Scenarios",
                                    text: "Leverage mocked interfaces of real services to test and refine your applications with confidence."
                                },
                                {
                                    icon: <RiFlowChart/>,
                                    title: "Simplify Production Integration",
                                    text: "Navigate the transition from development to production seamlessly with guided onboarding and tailored support."
                                },
                            ].map((h, idx)=>(
                                <div className="home-highlight" key={idx}>
                                    <div className="home-highlight-icon">
                                        { h.icon }
                                    </div>
                                    <div className="home-highlight-content">
                                        <div className="home-highlight-title">
                                            { h.title }
                                        </div>
                                        <div className="home-highlight-text">
                                            { h.text }
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                </div>
            </div>
        </div>



        
        <div id="home-contribute-section" className="section-container">
            <div className="home-section-background"/>
            <div className="home-section-transition-bottom"/>
            <div className="home-section-transition-top"/>
            <div className="section padding">
                <div id="home-contribute-container">
                    <div className="home-contribute-section">
                        <div id="home-contribute-image" className="home-contribute-icon">
                            <FaLaptopCode/>
                        </div>       

                        <div className="home-contribute-text">   
                            <div id="home-contribute-text-1" className="home-section-text">
                                Whether you're a developer, researcher, or innovator, the Sandbox is your playground to transform ideas into reality and bring new applications to life with minimal friction.
                                <br/>
                                <br/>
                            </div>        
                            {/* <NavLink
                                className={"button themed medium"}
                                to="/projects"
                            >
                                Start now
                            </NavLink> */}
                        </div>

                    </div>
                    <div className="home-contribute-section">
                        <div id="home-contribute-text-2" className="home-section-text home-contribute-text">
                        </div>   
                        <div id="home-contribute-text-2" className="home-contribute-text">   
                            <div className="home-section-text">
                                Join the Sandbox today to turn your vision into action and contribute to the Destination Earth initiative!
                                <br/>
                                <br/>
                            </div>
                            <NavLink
                                className={"button themed medium"}
                                to="/projects"
                            >
                                Start now
                            </NavLink>
                        </div>
                        <div id="home-contribute-image" className="home-contribute-icon">
                            <FaUsers/>
                        </div>               
                    </div>
                </div>               
            </div>
        </div>

        <div id="home-needs-section" className="section-container">
            <div className="section padding">
                <div id="home-needs-title" className="home-large-text">
                    Flexible, Cloud-powered Innovation at Your Fingertips
                </div>
                <div id="home-needs-container">
                    <div id="home-needs">
                        {
                            [
                                {
                                    icon: <ImCogs/>,
                                    title: "Customisable Resources",
                                    text: "Select the ideal machine specifications, from basic configurations to high-performance setups, ensuring the perfect balance of power and cost."
                                },
                                {
                                    icon: <IoHardwareChipSharp/>,
                                    title: "AI/ML Ready",
                                    text: "Supercharge your projects with GPU acceleration and a rich suite of AI/ML tools, enabling you to tackle complex models and large-scale data effortlessly."
                                },
                                {
                                    icon: <FaToolbox/>,
                                    title: "Versatile Software Kits",
                                    text: "Access a preconfigured library of software kits and frameworks or install your own, giving you complete control over your development stack."
                                },
                            ].map((h, idx)=>(
                                <div className="home-need" key={idx}>
                                    <div className="home-need-content">
                                        <div className="home-need-title">
                                            { h.title }
                                        </div>
                                        <div className="home-need-text">
                                            { h.text }
                                        </div>
                                    </div>
                                    <div className="home-need-icon">
                                        { h.icon }
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    <div id="home-needs-text" className="home-section-text">
                        The Sandbox takes adaptability to the next level by providing a cloud-based environment where you can tailor your workspace to your exact needs.
                    </div>

                </div>
            </div>
        </div>

        <div className="section padding">
            <div className="home-large-text">
                From prototyping to production, the Sandbox is built to adapt to your workflow and help you achieve your goals faster.
            </div>
        </div>

    </Page>
};
