import React, { ReactNode } from 'react';
import './HeaderBox.css';
import { Breadcrumbs, IBreadcrumb } from "@desp-aas/desp-ui-fwk";

type IProps = {
    background?: string
    children?: ReactNode
    breadcrumbs?: IBreadcrumb[]
}

export default function HeaderBox(props: IProps) {
    return (
        <div className="section header-box-section">
            <Breadcrumbs breadcrumbs={props.breadcrumbs}/>
            <div
                className="header-box sub-section"
                style={props.background ? {
                    backgroundImage: `url(${props.background})`
                } : undefined}
            >
                {props.children}
            </div>
        </div>
    )
}