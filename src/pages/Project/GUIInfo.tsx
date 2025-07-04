import { CopyButton } from "@desp-aas/desp-ui-fwk"
import { icons } from "../../utils/icons"
import { useSelector } from "react-redux"
import { ReduxState } from "../../redux"
import { IProject, SERVER_STATUS } from "@desp-aas/desp-ui-fwk/src/utils/types"

type IProps = {
    project: IProject
}

export const GUIInfo = (props: IProps) =>{
    // const [ guiLink ] = useState(window.location.host === 'sandbox.desp-aas.acri-st.fr' ? 'https://guacamole.desp-aas.acri-st.fr/#/' : 'https://guacamole.desp-aas-preprod.acri-st.fr/#/');

    const { gui_link } = useSelector((state: ReduxState)=> state.projects )

    return (
        <>
            {
                props.project.profile.password &&
                props.project.operatingsystem.is_gui &&
                props.project.server &&
                (
                    window.location.hostname === 'localhost'
                    ? [ SERVER_STATUS.INSTALLING, SERVER_STATUS.READY, SERVER_STATUS.ERROR ].includes(props.project.server.state)
                    : [ SERVER_STATUS.READY ].includes(props.project.server.state)
                ) &&
                <>
                    <div className="form-field horizontal">
                        <label>GUI Link:</label>
                        <div className="form-field-value">
                            <input readOnly defaultValue={gui_link} />
                            {/* <CopyButton text={gui_link} /> */}

                            <div className="form-field-value-operations">
                                <a
                                    id="open-project-git"
                                    className="button open-link inverted"
                                    href={gui_link}
                                    target="_blank"
                                >
                                    { icons.gitLink } Open GUI link
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="form-field horizontal">
                        <label>GUI User:</label>
                        <div className="form-field-value">
                            <input readOnly defaultValue={props.project.profile.username} />
                            <CopyButton text={props.project.profile.username} />
                        </div>
                    </div>
                    <div className="form-field horizontal">
                        <label>GUI Password:</label>
                        <div className="form-field-value">
                            <input readOnly defaultValue={props.project.profile.password} />
                            <CopyButton text={props.project.profile.password} />
                        </div>
                    </div>
                </>
            }
        </>
    )
}