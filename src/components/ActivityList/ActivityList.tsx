import React, { ReactNode } from 'react';
import './ActivityList.css';
import classNames from 'classnames';
import { PiWarningFill } from "react-icons/pi";
import dayjs from 'dayjs';
import { FaChevronRight } from 'react-icons/fa';


export type IActivity = {
    date: string
    tags?: string[]
    message: string
}

export type IActivityProps = {
    title: ReactNode
    activities?: IActivity[]
    noActivity?: ReactNode
}

export default function ActivityList(props: IActivityProps) {

    const formatDate = (d: string) => dayjs(d).format('DD/MM/YY HH:ss')
    return <div className="activity-list">
        <div className="activity-list-title">
            { props.title }
        </div>
        <div className="activity-item-list">
            {
                props.activities
                ?  props.activities.map((a, aIdx)=>(
                    <div className="activity-item" key={aIdx}>
                        <div className="activity-item-date">
                            { formatDate(a.date) }
                        </div>
                        <div className="activity-item-tags">
                            {
                                a.tags?.map((t, tIdx)=>(

                                    <div key={tIdx} className={classNames({ "activity-item-tag": true, [t]: true})}>
                                        { t === 'warn' ? <PiWarningFill/> : t }
                                    </div>
                                ))
                            }
                        </div>
                        <div className="activity-item-message">
                            { a.message }
                        </div>
                        <div className="activity-item-chevron">
                            <FaChevronRight/>
                        </div>
                    </div>
                ))
                : <div className="no-activity">
                    { props.noActivity || <>There are no ongoing activities.</> }
                </div>
            }
        </div>
    </div>
}