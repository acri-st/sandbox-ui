import { FaCircle } from 'react-icons/fa'
import './ProjectServerStatus.css'
import classNames from 'classnames'
import { IProject } from '@desp-aas/desp-ui-fwk/src/utils/types'

// state

type IProps = {
    project: IProject
    label?: boolean
}

export const ProjectServerStatus = (props: IProps) =>{
    return (
        <div className="project-server-status-container">
            {
                props.label &&
                <label>Server status</label>
            }
            <div className={classNames({ "project-server-status": true, [props.project.server?.state || 'Unknown']: true })}>
                <FaCircle/>
                <div className="project-server-status-label">
                    { props.project.server?.state || 'Unknown' }
                </div>
            </div>
        </div>
    )
}