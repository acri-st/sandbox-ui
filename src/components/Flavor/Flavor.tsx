import classNames from "classnames"
import './Flavor.css';
import { IFlavor } from "@desp-aas/desp-ui-fwk/src/utils/types";

type IProps = {
    flavor: IFlavor
    onClick?: () => any
    selected?: boolean
}

export const Flavor = (props: IProps) =>{
    return (
        <div 
            className={classNames({
                "project-flavor-option": true,
                "selected": props.selected
            })} 
            onClick={props.onClick}
        >
            <div className="project-flavor-spec project-flavor-name">
                {props.flavor.name}
            </div>
            <div className="project-flavor-spec project-flavor-processor">
                <label>Processor:</label>
                <div className="project-flavor-spec-value">
                {props.flavor.processor}
                </div>
            </div>
            <div className="project-flavor-spec project-flavor-memory">
                <label>Memory:</label>
                <div className="project-flavor-spec-value">
                {props.flavor.memory}
                </div>
            </div>
            <div className="project-flavor-spec project-flavor-bandwidth">
                <label>Bandwidth:</label>
                <div className="project-flavor-spec-value">
                    {props.flavor.bandwidth}
                </div>
            </div>
            <div className="project-flavor-spec project-flavor-storage">
                <label>Storage:</label>
                <div className="project-flavor-spec-value">
                    {props.flavor.storage}
                </div>
            </div>
            {
                props.flavor.gpu && 
                props.flavor.gpu !== "None" && 
                (
                    <div className="project-flavor-spec project-flavor-gpu">
                        <label>GPU:</label>
                        <div className="project-flavor-spec-value">
                            {props.flavor.gpu}
                        </div>
                    </div>
                )
            }
            <div className="project-flavor-price">
                { props.flavor.price && props.flavor.price.toLocaleLowerCase() !== 'free' ? `${props.flavor.price}€ / month` : "Free"}
            </div>
        </div>
    )
}



export const LoadingFlavorOption = () =>(
    <div className="loading-project-flavor-option loading">
        <div className="loading-project-flavor-name"/>
        <div className="loading-project-flavor-spec processor">
            <div className="loading-project-flavor-spec-label"/>
            <div className="loading-project-flavor-spec-value"/>
        </div>
        <div className="loading-project-flavor-spec memory">
            <div className="loading-project-flavor-spec-label"/>
            <div className="loading-project-flavor-spec-value"/>
        </div>
        <div className="loading-project-flavor-spec bandwidth">
            <div className="loading-project-flavor-spec-label"/>
            <div className="loading-project-flavor-spec-value"/>
        </div>
        <div className="loading-project-flavor-spec storage">
            <div className="loading-project-flavor-spec-label"/>
            <div className="loading-project-flavor-spec-value"/>
        </div>
        <div className="loading-project-flavor-price"/>
    </div>
)