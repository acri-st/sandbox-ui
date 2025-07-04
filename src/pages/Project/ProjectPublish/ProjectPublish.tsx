import { ReactNode } from "react";
import { IProjectSectionProps } from "../Project";
import { SearchBar, Table } from "@desp-aas/desp-ui-fwk";
import './ProjectPublish.css';



export default function ProjectPublish(props: IProjectSectionProps) {
    return (
        <>
            <div id="publish-content">
                <div id="publish-left">
                    <div id="publish-search" className="sub-section">
                        <h3>Container registry:</h3>
                        <SearchBar
                            value={""}
                            onChange={() => { }}
                            // searchCallback={async () => { }}
                        />
                    </div>
                    <div id="publish-search-results" className="sub-section">
                        <div className="publish-results">
                            <Table
                                headers={[
                                    { label: "Name", field: 'name', type: 'text' },
                                    { label: "Modified", field: 'modification_date', type: 'date' },
                                ]}
                                rows={[
                                    { name: 'Project-1 v1.0', modification_date: new Date('2024-09-26T16:51') },
                                    { name: 'Project-1 v0.9', modification_date: new Date('2024-09-26T16:41') },
                                    { name: 'Project-1 v0.8', modification_date: new Date('2024-09-26T16:31') },
                                    { name: 'Project-1 v0.7', modification_date: new Date('2024-09-26T16:21') },
                                    { name: 'Project-1 v0.6', modification_date: new Date('2024-09-26T16:11') },
                                    { name: 'Project-1 v0.5', modification_date: new Date('2024-09-25T10:51') },
                                    { name: 'Project-1 v0.4', modification_date: new Date('2024-09-26T10:31') },
                                    { name: 'Project-1 v0.3', modification_date: new Date('2024-09-26T10:21') },
                                ]}
                            />
                        </div>
                    </div>

                </div>
                <div id="publish-right">
                    <div id="publish-published-search" className="sub-section">
                        <h3>Published images:</h3>
                        <SearchBar
                            value={""}
                            onChange={() => { }}
                            // searchCallback={async () => { }}
                        />
                    </div>
                    <div id="publish-published-results" className="sub-section">
                        <div className="publish-results">
                            <Table
                                headers={[
                                    { label: "Name", field: 'name', type: 'text' },
                                    { label: "Status", field: 'status', type: 'text' },
                                ]}
                                rows={[

                                    { name: 'Project-1 v1.0', status: 'published' },
                                ]}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}