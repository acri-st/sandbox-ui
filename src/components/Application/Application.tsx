import classNames from "classnames"
import './Application.css';
import { IApplication } from "@desp-aas/desp-ui-fwk/src/utils/types";

type IProps = {
    application: IApplication
    onClick?: () => any
    selected?: boolean
}

export const Application = (props: IProps) =>{
    return (
        <div 
            className={classNames({ 
                "project-application-option": true, 
                "selected": props.selected,
            })} 
            onClick={props.onClick}
        >
            {/* <div className="project-application-image">
                <img src={app.icon}/>
            </div> */}
            <div className="project-application-information">
                <div className="project-application-info project-application-name">
                    {props.application.name}
                </div>
                <div className="project-application-info project-application-description">
                    {props.application.description}
                </div>
            </div>
        </div>
    )
}

