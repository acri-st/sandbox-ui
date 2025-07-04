import classNames from "classnames"
import './OperatingSystem.css';
import { IOperatingSystem } from "@desp-aas/desp-ui-fwk/src/utils/types";

type IProps = {
    operatingSystem: IOperatingSystem
    onClick?: () => any
    selected?: boolean
}

export const OperatingSystem = (props: IProps) =>{
    return (
        <div 
            className={classNames({ 
                "project-os-option": true, 
                "selected": props.selected,
            })} 
            onClick={props.onClick}
        >
            {props.operatingSystem.name}
        </div>
    )
}


export const LoadingOperatingSystem = () =>(
    <div className="loading-project-os-option loading">
        <div className="loading-project-os-option-value"/>
    </div>
)