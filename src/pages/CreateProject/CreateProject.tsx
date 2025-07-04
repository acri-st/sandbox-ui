import React, { useCallback, useEffect, useState } from 'react';

import './CreateProject.css';
import { Navigation } from '../../components/Navigation/Navigation';
import MandatoryField from '../../components/MandatoryField/MandatoryField';
import { Breadcrumbs, Form, IFormField, Loading, Logger, LoginRequired, Page, formReady, useUser, toast, FormField, Required, useFormFieldReady, handleRequestError, formFieldReady, createProject, getFlavors, getOperatingSystems } from "@desp-aas/desp-ui-fwk";
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';
import classNames from 'classnames';
import { DEFAULT_SOFTWARE } from '../../utils/applications';
import { icons } from '../../utils/icons';
import { ProjectNameRegex } from '../../utils/projects';
import FormFieldValidation, { IFormValidation } from '@desp-aas/desp-ui-fwk/src/components/FormFieldValidation/FormFieldValidation';
import { sshKeyRegex } from '../../utils/tools';
import { NavLink } from 'react-router-dom';
import { Flavor, LoadingFlavorOption } from '../../components/Flavor/Flavor';
import { LoadingOperatingSystem, OperatingSystem } from '../../components/OperatingSystem/OperatingSystem';
import { Application } from '../../components/Application/Application';
import { IFlavor, IOperatingSystem, IApplication } from '@desp-aas/desp-ui-fwk/src/utils/types';

const logger = new Logger("pages", "CreateProject");

type IForm = {
    name: string
    ssh_key: string
    flavor: IFlavor
    operating_system: IOperatingSystem
    applications: IApplication[]
}

const _defaultForm = {
    name: '',
    ssh_key: '',
    applications: []
}


const formFields:IFormField[] = [
    { required: true, field: 'name', label: <>Name</> },        
]

const sshKeyValidation:IFormValidation[] = [
    {
        description: <>Must be a valid SSH key</>,
        validation: (value)=>sshKeyRegex.test(value)
    }
]
const nameValidation:IFormValidation[] = [
    {
        description: <>The name must start and end with a letter. Allowed characters: letter, underscore (_) and space. No consecutive special characters.</>,
        validation: (value)=>ProjectNameRegex.test(value)
    }
]

const sortFalvorPriceValue = (a: IFlavor) => {
    if( !a.price || a.price.toLocaleLowerCase() === 'free') return 0;
    return parseInt(a.price);
}


export default function CreateProject() {
    const navigate = useNavigate();
    
    const [loadingFlavors, setLoadingFlavors] = useState(false);
    const [creating, setCreating] = useState(false);
    const [flavors, setFlavors] = useState<IFlavor[]|undefined>();
    
    const [loadingOperatingSystems, setLoadingOperatingSystems] = useState(false);
    const [allOperatingSystems, setAllOperatingSystems] = useState<IOperatingSystem[]>();
    const [operatingSystems, setOperatingSystems] = useState<IOperatingSystem[]|undefined>();
    const [applications, setApplications] = useState<IApplication[]>();
    
    const [ isFormReady, setIsFormReady ] = useState(false);
    const [ createDisabled, setCreateDisabled ] = useState(false);
    
    const [form, setForm] = useState<Partial<IForm>>(_.cloneDeep(_defaultForm))

    const formIsValid = formFieldReady({ validation: nameValidation }, form.name) &&
        formFieldReady({ validation: sshKeyValidation }, form.ssh_key);

    
    const user = useUser();
    
    useEffect(() => {
        if(user){
            fetchFlavors();
            fetchOperatingSystems();
        }
    }, [user])


    const updateForm = useCallback((updates: Partial<IForm>) => {
        setForm((prevForm)=>({ ...prevForm, ...updates }));
    }, [ form ])

    const fetchFlavors = useCallback(() => {
        setLoadingFlavors(true);
        getFlavors()
        .then((response)=>{
            setFlavors(
                response
                .sort((a, b)=> sortFalvorPriceValue(a) - sortFalvorPriceValue(b) )
            )
            updateForm({ flavor: response?.[0] })
        })
        .catch(handleRequestError)
        .finally(()=> setLoadingFlavors(false) )
    }, [ ])

    const fetchOperatingSystems = useCallback(()=>{
        setLoadingOperatingSystems(true)
        getOperatingSystems()
        .then((response)=>{
            setAllOperatingSystems(response)
            // updateForm({ operating_system: response?.[0] })
        })
        .catch(handleRequestError)
        .finally(()=> setLoadingOperatingSystems(false) )
    }, [])

    useEffect(()=>{
        console.log("form.flavor", form.flavor)
        let filtered = form.flavor && form.flavor.gpu !== undefined && form.flavor.gpu !== '' && form.flavor.gpu !== null && form.flavor.gpu !== "None"
            ?  allOperatingSystems?.filter((os)=> os.name.toLowerCase().includes("gpu"))
            : allOperatingSystems?.filter((os)=> !(os.name.toLowerCase().includes("gpu")))

        // let filtered = allOperatingSystems;
        setOperatingSystems(filtered)
        updateForm({ operating_system: filtered?.[0] })
    }, [ allOperatingSystems, form.flavor ])

    

    const handleApplicationClick = useCallback((app: IApplication)=>{
        let find = form.applications?.findIndex((a)=> a.id === app.id);
        let entities = [ ...form.applications || [] ];
        if(find !== undefined && find !== -1){
            entities.splice(find, 1);
        }
        else{
            entities.push(app)
        }
        updateForm({ applications: entities })
    }, [ form, updateForm ])

    useEffect(()=>{
        setIsFormReady(!!form.name && !!form.ssh_key && !!form.flavor && !!form.operating_system && formIsValid)
    }, [formFields, form, formIsValid]);

    useEffect(()=>{ 
        setCreateDisabled(creating || !isFormReady)
    }, [ isFormReady, creating ])

    useEffect(()=>{
        console.log("updated operating")
        setApplications([...form.operating_system?.applications || []]);        
    }, [ form.operating_system ])

    useEffect(()=>{
        let newApps = [...form.operating_system?.applications || []];
        updateForm({ applications: [...form.applications || []].filter((app)=>newApps.find((a)=> a.id === app.id)  ) })
        setApplications(newApps);        
    }, [ form.operating_system ])


    const create = async () => {
        if (creating) return;
        logger.info("Creating project...")
        setCreating(true)
        try {
            let f = form as any as IForm;
            await createProject({
                name: f.name,
                flavor_id: f.flavor.id,
                ssh_key: f.ssh_key,
                operatingsystem_id: f.operating_system.id,
                application_ids: f.applications.map((app)=> app.id)
            });
            toast(<>Successfully created project</>, { type: "success" })
            navigate('/projects')
        }
        catch (e) {
            logger.error("create error", e)
            handleRequestError(e as any,
                { defaultMessage: "An issue has occured while creating the project, please try again later" }
            )
        }
        finally {
            setCreating(false)
        }
    }


    return (
        <Page id="create-project" fixedHeight>
            <Navigation />
            <LoginRequired>

                {/* <div className="fixed-page-content"> */}
                <div className="fixed-page-content">
                    <div className="section no-margin-bottom">

                        <Breadcrumbs
                            breadcrumbs={[
                                { label: "Home", path: '/' },
                                { label: "Projects", path: 'projects' },
                                { label: "New Project", path: '' },
                            ]}
                        />
                    </div>
                    <div id="create-project-section" className="section">
                        <div id="create-project-form" className="sub-section">
                            <div id="create-project-form-content" className="simple-scrollbar">
                                <FormField
                                    required
                                    value={form.name}
                                    horizontal
                                    label={<>Name</>}
                                    validation={nameValidation}
                                    onUpdate={(name)=>{ updateForm({ name }) }}
                                    id="project-field-name"
                                />
                                <div className="form-field horizontal">
                                    <label>
                                        Flavor: <div className='required'>*</div>
                                    </label>
                                    <div id="project-flavor-selection">
                                        {
                                            loadingFlavors
                                            ? 
                                                <>
                                                    <LoadingFlavorOption/>
                                                </>
                                            : 
                                            !(flavors && flavors.length > 0)
                                            ? <div>No flavors available.</div>
                                            :
                                            // resourceTypes
                                            flavors.map((f, idx)=>(
                                                <Flavor
                                                    key={idx}
                                                    selected={form.flavor === f}
                                                    flavor={f}
                                                    onClick={()=> updateForm({ flavor: f })}
                                                />
                                            ))
                                        }
                                    </div>
                                </div>

                                <div className="form-field horizontal">
                                    <label>
                                        Operating system: <div className='required'>*</div>
                                    </label>
                                    <div id="project-os-selection">
                                        {
                                            
                                            loadingOperatingSystems
                                            ? 
                                                <>
                                                    <LoadingOperatingSystem/>
                                                </>
                                            : !(operatingSystems && operatingSystems.length > 0)
                                            ? <div>No options available.</div>
                                            :
                                                operatingSystems?.map((os)=>(
                                                    <OperatingSystem
                                                        operatingSystem={os} key={os.id}
                                                        onClick={()=> updateForm({ operating_system: os })}
                                                        selected={form.operating_system?.id === os.id}
                                                    />
                                                ))
                                        }
                                    </div>
                                </div>

                                <div className="form-field horizontal"  id="project-application-label">
                                    <label>
                                        Software: 
                                        {/* <div className='required'>*</div> */}
                                    </label>
                                </div>

                                <p>
                                    Need a software already setup inside the virtual machine? We offer the best frameworks on the market.
                                </p>
                                
                                <div id="project-application-selection">
                                    {
                                        applications?.map(( app, idx)=>(
                                            <Application 
                                                application={app} key={idx}
                                                onClick={()=>handleApplicationClick(app)}
                                                selected={form.applications?.some((a)=> a.id === app.id)}
                                            />
                                        ))
                                    }
                                </div>

                                
                                <p>
                                    By default the following software are installed:
                                </p>
                                <div id="default-software">

                                    {
                                        DEFAULT_SOFTWARE.map((v)=>(
                                            <div className="default-software-name" key={v} > {icons.listDot} {v}</div>
                                        ))
                                    }
                                </div>

                                {/* <FormField
                                    label={<>SSH Key<Required/></>}
                                    value={form.ssh_key}
                                    onUpdate={(ssh_key)=>{ updateForm({ ssh_key }) }}
                                    validation={sshKeyValidation}
                                    textArea={{}}
                                /> */}
                                <div className="form-field" id="project-field-ssh-key">
                                    <label>SSH Key<Required/></label>
                                    <p>
                                        If you need help on creating or getting your SSH key, please check our <NavLink 
                                            target="_blank" 
                                            // to="/user-guides/project-ssh-key"
                                            to="/help/documentation/vm/access.html#how-to-generate-a-ssh-key"
                                        >SSH key guide</NavLink>
                                    </p>
                                    <div className="form-field-value">
                                        <textarea 
                                            value={form.ssh_key}
                                            onChange={(e)=>{ updateForm({ ssh_key: e.target.value }) }}
                                        />
                                        <FormFieldValidation
                                            value={form.ssh_key}
                                            validation={sshKeyValidation}
                                        />
                                    </div>
                                </div>

                            </div>


                        </div>
                    </div>

                    <div id="create-project-finalisation" className="section no-background">
                        <MandatoryField />
                        <div id="create-project-buttons">
                            <div
                                className={classNames({
                                    "button medium filled": true, 
                                    "disabled": createDisabled
                                })}
                                id="create-project-button"
                                onClick={!createDisabled ? create : undefined}
                            >
                                {
                                    creating
                                    ? <><Loading/> Saving...</>
                                    : <>Save</>
                                }
                            </div>
                            <div
                                id="cancel-project-button"
                                className="button medium"
                                onClick={() => { navigate('/projects') }}
                            >
                                Cancel
                            </div>
                        </div>
                    </div>
                </div>
            </LoginRequired>

        </Page>
    );
};



const LoadingApplication = () =>(
    <div className="loading-project-application-option loading">
        <div className="loading-project-application-option-value"/>
    </div>
)