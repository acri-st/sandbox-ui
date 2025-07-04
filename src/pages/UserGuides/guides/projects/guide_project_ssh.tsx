import { Tabs } from "@desp-aas/desp-ui-fwk";
import { IGuide } from "../../UserGuides";
import { useEffect, useState } from "react";
import { FaApple, FaLinux, FaWindows } from "react-icons/fa";
import { CopyBlock, tomorrowNightBlue } from 'react-code-blocks';
import { getOS } from "../../../../utils/tools";


const Code = (props: { text: string }) =>(
    <CopyBlock
        theme={tomorrowNightBlue}
        showLineNumbers
        language={"bash"} 
        text={props.text}
    />
)

const linuxSteps = {
    "1": <>
        <h3>Step 1: Check for Existing SSH Keys</h3>
        <p>
            Open a terminal and run:
        </p>
        <Code text={"ls -al ~/.ssh"}/>
        <p>
            If you see <b>desp_id_rsa</b> and <b>desp_id_rsa.pub</b>, or any other similar files you already have an SSH key pair.
        </p>

    </>,
    "2": <>
        <h3>Step 2: Generate a New SSH Key Pair</h3>
            <p>
                To create a new SSH key:
            </p>
            <Code text={`ssh-keygen -t rsa -b 4096 -f ~/.ssh/desp_id_rsa`}/>
            <ul>
                <li>-t rsa: Specifies the RSA algorithm.</li>
                <li>-b 4096: Sets a strong 4096-bit key.</li>
                <li>-f: Creates the key at ~/.ssh/desp_id_rsa. If you wish to name it to something else replace the <b>desp_id_rsa</b> to something else.</li>
            </ul>
            <b>
                When prompted:
            </b>
            <ul>
                <li>
                    <b>Passphrase:</b> Optional but recommended for extra security.
                </li>
            </ul>
    </>,
    "3": <>
        <h3>Step 3: Start the SSH Agent and Add the Key</h3>
        
        <ol>
            <li>
                <p>Start the SSH agent:</p>
                <Code text={`eval "$(ssh-agent -s)"`}/>
            </li>
            <li>
                <p>Add your private key to the agent:</p>
                <Code text={`ssh-add ~/.ssh/desp_id_rsa`}/>
            </li>
        </ol>
    </>,
    "4": <>
            <h3>Step 4: Copy the Public Key to the Server</h3>
            <p>
                Now you may copy the SSH key to use it on the project
            </p>
            <ul>
                <li>
                    <p>Manual:</p>
                    <Code text={`cat ~/.ssh/desp_id_rsa.pub`}/>
                </li>
                <li>
                    <p>Copy directy to clipboard (if xclip  is installed):</p>
                    <Code text={`cat ~/.ssh/desp_id_rsa.pub | xclip -sel clip`}/>
                </li>
            </ul>
            <p>
                <b>IMPORTANT:</b> Make sure it's the .pub that you are copying and not your private key.
            </p>
        </>
}

const linuxStepsAll = (
    <>
        { linuxSteps[1] }
        { linuxSteps[2] }
        { linuxSteps[3] }
        { linuxSteps[4] }
    </>
)
// type %homedrive%%homepath%\.ssh\desp_id_rsa.pub
const WindowSteps = (props: { powershell?: boolean})=> {
    const homeDir = props.powershell ? '$HOME' : '%homedrive%%homepath%'
    const printFileCommand = props.powershell ? 'cat' : 'type'
    return (
        <>
            <h3>Step 1: Check for Existing SSH Keys</h3>
            <p>
                Open a terminal and run:
            </p>
            <Code text={`dir ${homeDir}\\.ssh\\`}/>
            <p>
                If you see <b>desp_id_rsa</b> and <b>desp_id_rsa.pub</b>, or any other similar files you already have an SSH key pair.
            </p>
            <h3>Step 2: Add SSH Key to the Agent</h3>
            <ol>
                <li><p>Open PowerShell.</p></li>
                <li>
                    <p>Generate the key:</p>
                    <Code text={`ssh-keygen -t rsa -b 4096 -f ${homeDir}\\.ssh\\desp_id_rsa`}/>
                    
                    <ul>
                        <li>-t rsa: Specifies the RSA algorithm.</li>
                        <li>-b 4096: Sets a strong 4096-bit key.</li>
                        <li>-f: Creates the key at .ssh\desp_ui_id_rsa. If you wish to name it to something else replace the <b>desp_id_rsa</b> to something else.</li>
                    </ul>
                                                
                    <b>
                        When prompted:
                    </b>
                    <ul>
                        <li>
                            <b>Passphrase:</b> Optional but recommended for extra security.
                        </li>
                    </ul>
                </li>

                <li>
                    <p>The keys will be saved in %homedrive%%homepath%\YourUsername\.ssh.</p>
                </li>

            </ol>

            <h3>Step 3: Get the Public Key</h3>
            <p>
                Now you may copy the SSH key and paste it to the ssh key section in /projects/create
            </p>
            <ul>
                <li>
                    <p>Manual:</p>
                    <Code text={`${printFileCommand} ${homeDir}\\.ssh\\desp_id_rsa.pub`}/>
                </li>
                <li>
                    <p>Copy directy to clipboard:</p>
                    <Code text={`${printFileCommand} ${homeDir}\\.ssh\\desp_id_rsa.pub | clip.exe`}/>
                </li>
            </ul>
            <p>
                <b>IMPORTANT:</b> Make sure it's the .pub that you are copying and not your private key.
            </p>
        </>
    )
}

const Content = () =>{
    const [ selected, setSelected ] = useState( 'windows');
    const [ selectedOption, setSelectedOption ] = useState('option-1');

    useEffect(()=>{
        switch(getOS()){
            case 'windows': setSelected('windows'); break;
            case 'linux': setSelected('linux'); break;
            // case 'macos': setSelected('macos'); break;
        }
    }, [])
    
    return (
        <>
            <p>
                The Sanbox project requires an SSH key to access your virtual space securely.
                This guide will help you generate the SSH key to access your virtual workspace.
            </p>
            <h2>What is an SSH Key?</h2>
            
            <p>
                An SSH (Secure Shell) key is a pair of cryptographic keys used for secure authentication between devices. It includes:

                <ul>
                    <li>
                        <b>Private key:</b> Kept securely on your local machine.
                    </li>
                    <li>
                        <b>Public key:</b> Shared with the remote server for authentication.
                    </li>
                </ul>
            </p>

            <h2>How to generate an SSH key</h2>
            <Tabs
                tabs={[
                    { label: <><FaWindows/> Windows</>, path: "windows" },
                    { label: <><FaLinux/> Linux</>, path: "linux" },
                    // { label: <><FaApple/> MacOS</>, path: "macos" },
                ]}
                onSelect={(selected)=>{setSelected(selected); setSelectedOption('option-1')}}
                selected={selected}
            />

            
            {
                selected === "windows" &&
                <>
                    <Tabs
                        tabs={[
                            { label: <>Option  1: Using Git Bash or WSL</>, path: "option-1" },
                            { label: <>Option 2: Using Command prompt</>, path: "option-2" },
                            { label: <>Option 3: Using PowerShell</>, path: "option-3" },
                        ]}
                        onSelect={setSelectedOption}
                        selected={selectedOption}
                    />
                    {
                        selectedOption === 'option-1' &&
                        <>
                            { linuxSteps[1] }
                            { linuxSteps[2] }
                            { linuxSteps[3] }

                            <h3>Step 4: Copy the Public Key to the Server</h3>
                            <p>
                                Now you may copy the SSH key to use it on the project
                            </p>
                            <ul>
                                <li>
                                    <p>Manual:</p>
                                    <Code text={`cat ~/.ssh/desp_id_rsa.pub`}/>
                                </li>
                                <li>
                                    <p>Copy directy to clipboard:</p>
                                    <Code text={`cat ~/.ssh/desp_id_rsa.pub | clip.exe`}/>
                                </li>
                            </ul>
                            <p>
                                <b>IMPORTANT:</b> Make sure it's the .pub that you are copying and not your private key.
                            </p>
                        </>
                    }
                    {
                        selectedOption === 'option-2' &&
                        <WindowSteps/>
                    }
                    {
                        selectedOption === 'option-3' &&
                        <WindowSteps powershell/>
                    }
                </>
            }
            
            {
                selected === "linux" &&
                <>
                    { linuxStepsAll }
                </>
            }
            {
                selected === "macos" &&
                <>
                    { linuxSteps[1] }
                    { linuxSteps[2] }
                    { linuxSteps[3] }
                    <h3>Step 4: Copy the Public Key to the Server</h3>
                    <p>
                        Now you may copy the SSH key to use it on the project
                    </p>
                    <ul>
                        <li>
                            <p>Manual:</p>
                            <Code text={`cat ~/.ssh/desp_id_rsa.pub`}/>
                        </li>
                        <li>
                            <p>Copy directy to clipboard (if pbcody is installed):</p>
                            <Code text={`cat ~/.ssh/desp_id_rsa.pub | pbcopy`}/>
                        </li>
                    </ul>
                    <p>
                        <b>IMPORTANT:</b> Make sure it's the .pub that you are copying and not your private key.
                    </p>
                </>
            }

        </>
    )
}

export const guide_project_ssh: IGuide = {
    id: "project-ssh-key",
    title: "Project SSH key",
    category: "project",
    content: <Content/>
}
