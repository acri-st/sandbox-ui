import { useEffect, useState } from "react"
import { CopyButton } from "@desp-aas/desp-ui-fwk"
import { IProject } from "@desp-aas/desp-ui-fwk/src/utils/types";


export const ProjectNameRegex = /^(?!.*__)[a-zA-Z0-9](?:[a-zA-Z0-9_\s]*[a-zA-Z0-9])?$/;

export const checkProjectLoopCondition = (project: IProject|undefined) =>{
    // return !(project?.server?.state && project.server.state === SERVER_STATUS.READY)
    return true;
}


export const useProjectGitURL = (project: IProject) =>{
    const [ gitUrl, setGitUrl ] = useState<string>();

    useEffect(()=>{
        setGitUrl(project.repository.url.replace(":","/").replace("git@", "https://").replace(".git", ""))
    }, [ project ])

    return gitUrl;

}
export const useProjectGitTokenURL = (project: IProject) =>{
    const [ gitTokenUrl, setGitTokenUrl ] = useState<string>();

    useEffect(()=>{
        setGitTokenUrl( `git clone https://oauth2:${project.repository.token}@` + project.repository.url.replace(":","/").replace("git@", "").replace(".git", "") + ` "${project.name}"`)
    }, [ project ])

    return gitTokenUrl;

}

export const DockerImages = (props: {project: IProject}) =>{
    const [ images, setImages ] = useState<string[]|undefined>(props.project.docker_image?.split(','))

    useEffect(()=>{
        setImages(props.project.docker_image?.split(','))
    }, [ props.project ])

    if(!images) 
        return (
            <div className="form-field horizontal">
                <label>Docker Image:</label>
                <div className="form-field-value">
                    <input type="text" readOnly placeholder="Not yet generated" defaultValue={''} />
                </div>
            </div>
        )
    else
        return (
            <div className="form-field horizontal">
                <label>Docker Image{ images.length > 1 ? 's' : '' }:</label>
                <div className="form-field-value docker-images-values">
                    {
                        images.map((image)=>(
                            <div className="docker-image-value">
                                <input type="text" readOnly defaultValue={image} />
                                <CopyButton text={image} />
                            </div>

                        ))
                    }
                </div>
            </div>
            
        )

}