import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { IProjectSectionProps } from "../Project";
import { ConnectProject } from "../ProjectOverview/ProjectOverview";
import { CopyButton, getCPUUsage, getDiskUsage, getMemoryUsage, getNetworkUsage, handleRequestError, Loading, Tabs, useInterval } from "@desp-aas/desp-ui-fwk";
import { Flavor } from "../../../components/Flavor/Flavor";
import { OperatingSystem } from "../../../components/OperatingSystem/OperatingSystem";
import { Application } from "../../../components/Application/Application";
import { Events } from "../../../components/Events/Events";
import { GUIInfo } from "../GUIInfo";
import ReactECharts, { EChartsOption } from 'echarts-for-react';
import dayjs from "dayjs";
import classNames from "classnames";
import './ProjectVirtualMachine.css';
import { IProject, IMetricValue } from "@desp-aas/desp-ui-fwk/src/utils/types";

export default function ProjectVirtualMachine(props: IProjectSectionProps) {

    const [ selectedSection, setSelectedSection ] = useState<string>("information");



    return (
        <>
            <div id="virtual-machine-content" className="project-section-content">
                <div className="project-section-left-side">
                    {
                        props.project.server &&
                        props.project.server?.public_ip &&
                        <Tabs
                            tabs={[
                                {
                                    label: "Information",
                                    path: "information"
                                },
                                {
                                    label: "Monitoring",
                                    path: "monitoring"
                                }
                                
                            ]}
                            selected={selectedSection}
                            onSelect={setSelectedSection}
                        />
                    }
                    <div className="sub-section">
                        <div className="sub-section-content">
                            {
                                selectedSection === "information" &&
                                <>
                                    <div className="form-field public-ip horizontal">
                                        <label>Public IP:</label>
                                        <div className="form-field-value">
                                            <input type="text" readOnly defaultValue={props.project.server?.public_ip || ''} />
                                            <CopyButton text={props.project.server?.public_ip || ''} />
                                        </div>
                                    </div>
                                    {
                                        props.project.server?.public_ip &&
                                        <>
                                            <div className="form-field quick-connect horizontal">
                                                <label>Quick connect: </label>
                                                <div className="form-field-value column">
                                                    <p>
                                                        Connect with the following:
                                                    </p>
                                                    <ConnectProject project={props.project}/>
                                                </div>
                                            </div>

                                        </>
                                    }
                                    <GUIInfo project={props.project}/>
                                    
                                    <div className="form-field horizontal">
                                        <label>SSH key:</label>
                                        <div className="form-field-value">
                                            <textarea readOnly defaultValue={props.project.ssh_key} />
                                        </div>
                                    </div>
                                    
                                    
                                    <div className="form-field horizontal">
                                        <label>Flavor:</label>
                                        <div className="form-field-value centered-content">
                                            <Flavor flavor={props.project.flavor} selected/>
                                        </div>
                                    </div>

                                    <div className="form-field horizontal">
                                        <label>Operating system:</label>
                                        <div className="form-field-value centered-content">
                                            <OperatingSystem operatingSystem={props.project.operatingsystem} selected />
                                        </div>
                                    </div>

                                    
                                    <div className="form-field horizontal">
                                        <label>Software:</label>
                                        <div className="form-field-value">
                                            {
                                                props.project.applications.length > 0
                                                ? <div id="project-application-list">
                                                    {
                                                        props.project.applications.map((app, idx)=>(
                                                            <Application application={app} key={app.id} selected/>
                                                        ))
                                                    }
                                                </div>
                                                : <div className="no-data">
                                                    <br/>
                                                    No applications
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </>
                            }
                            {
                                selectedSection === "monitoring" &&
                                <>
                                    <VirtualMachineMonitoring project={props.project}/>
                                </>
                            }
                            
                        </div>

                    </div>
                </div>
                <div className="project-section-right-side">
                    <div className="sub-section">
                        <Events project={props.project} type="VM"/>
                    </div>
                </div>

            </div>
        </>
    )
}

const TIME_RANGE_OPTIONS = [
    {
        label: "30m",
        value: 1800
    },    
    {
        label: "1h",
        value: 3600
    },
    {
        label: "4h",
        value: 14400
    },
    {
        label: "1d",
        value: 86400
    },
    {
        label: "7d",
        value: 604800
    },
    {
        label: "30d",
        value: 2592000
    }
]
const VirtualMachineMonitoring = (props: { project: IProject }) =>{

    const [ loadingCPUUsage, setLoadingCPUUsage ] = useState<boolean>(false);
    const [ loadingMemoryUsage, setLoadingMemoryUsage ] = useState<boolean>(false);
    const [ loadingDiskUsage, setLoadingDiskUsage ] = useState<boolean>(false);
    const [ loadingNetworkUsage, setLoadingNetworkUsage ] = useState<boolean>(false);

    const [ cpuUsage, setCpuUsage ] = useState<IMetricValue|undefined>(undefined);
    const [ cpuUsageTimeRange, setCpuUsageTimeRange ] = useState<number>(TIME_RANGE_OPTIONS[1].value);
    const [ memoryUsage, setMemoryUsage ] = useState<IMetricValue|undefined>(undefined);
    const [ memoryUsageTimeRange, setMemoryUsageTimeRange ] = useState<number>(TIME_RANGE_OPTIONS[1].value);
    const [ diskUsage, setDiskUsage ] = useState<{ [disk: string]: IMetricValue }|undefined>(undefined);
    const [ diskUsageTimeRange, setDiskUsageTimeRange ] = useState<number>(TIME_RANGE_OPTIONS[1].value);
    const [ networkUsage, setNetworkUsage ] = useState<{ [direction: string]: IMetricValue }|undefined>(undefined);
    const [ networkUsageTimeRange, setNetworkUsageTimeRange ] = useState<number>(TIME_RANGE_OPTIONS[1].value);

    useEffect(()=>{ fetchCPUUsage(true) }, [cpuUsageTimeRange])
    useEffect(()=>{ fetchMemoryUsage(true) }, [memoryUsageTimeRange])
    useEffect(()=>{ fetchDiskUsage(true) }, [diskUsageTimeRange])
    useEffect(()=>{ fetchNetworkUsage(true) }, [networkUsageTimeRange]);

    const formatData = useCallback((data: IMetricValue) =>{
        return {
            ...data,
            data: data.data.map(d => ({...d, value: Number(d.value.toFixed(2))}))
        }
    }, [])


    const fetchCPUUsage = useCallback((refresh?: boolean) =>{
        // setCpuUsage({ name: "CPU Usage", data: test_metrics_cpu[cpuUsageTimeRange] })
        // return;
        if(props.project.server){
            if(refresh)setLoadingCPUUsage(true);
            getCPUUsage(props.project.server.id, cpuUsageTimeRange)
            .then((data)=>{ setCpuUsage(formatData(data)); })
            .catch((error)=>{ handleRequestError(error); })
            .finally(()=>{ if(refresh)setLoadingCPUUsage(false); })
        }
    }, [props.project.server, cpuUsageTimeRange])
    const fetchMemoryUsage = useCallback((refresh?: boolean) =>{
        // setMemoryUsage({ name: "Memory Usage", data: test_metrics_memory[memoryUsageTimeRange] })
        // return;
        if(props.project.server){
            if(refresh)setLoadingMemoryUsage(true);
            getMemoryUsage(props.project.server.id, memoryUsageTimeRange)
            .then((data)=>{ setMemoryUsage(formatData(data)); })
            .catch((error)=>{ handleRequestError(error); })
            .finally(()=>{ if(refresh)setLoadingMemoryUsage(false); })
        }
    }, [props.project.server, memoryUsageTimeRange])
    const fetchDiskUsage = useCallback((refresh?: boolean) =>{
        // setMemoryUsage({ name: "Memory Usage", data: test_metrics_memory[memoryUsageTimeRange] })
        // return;
        if(props.project.server){
            if(refresh)setLoadingDiskUsage(true);
            getDiskUsage(props.project.server.id, diskUsageTimeRange)
            .then((data)=>{ setDiskUsage(Object.fromEntries(Object.entries(data).map(([key, value]) => [key, formatData(value)]))); })
            .catch((error)=>{ handleRequestError(error); })
            .finally(()=>{ if(refresh)setLoadingDiskUsage(false); })
        }
    }, [props.project.server, diskUsageTimeRange])
    const fetchNetworkUsage = useCallback((refresh?: boolean) =>{
        if(props.project.server){
            if(refresh)setLoadingNetworkUsage(true);
            getNetworkUsage(props.project.server.id, networkUsageTimeRange)
            .then((data)=>{ 
                // Data is in bytes/s, we need to convert it to Mbits/s
                // const networkUsage: { [direction: string]: IMetricValue } = {};
                // for(const [direction, values] of Object.entries(data)){
                //     networkUsage[direction] = {
                //         ...values,
                //         data: values.data.map(d => ({...d, value: d.value / 1024 / 1024 / 8}))
                //     };
                // }
                // setNetworkUsage(networkUsage); 

                setNetworkUsage(Object.fromEntries(Object.entries(data).map(([key, value]) => [key, formatData(value)])));
            })
            .catch((error)=>{ handleRequestError(error); })
            .finally(()=>{ if(refresh)setLoadingNetworkUsage(false); })
        }
    }, [props.project.server, networkUsageTimeRange])

    const refreshData = useCallback(() => {
        fetchCPUUsage()
        fetchMemoryUsage()
        fetchDiskUsage()
        fetchNetworkUsage()
    }, [fetchCPUUsage, fetchMemoryUsage, fetchDiskUsage, fetchNetworkUsage])

    // AUTO REFRESH
    useInterval(5000, refreshData)
    // useInterval(5000, () => {
    //     fetchCPUUsage(false)
    //     fetchMemoryUsage()
    //     fetchDiskUsage()
    //     fetchNetworkUsage()
    // })

    
    const getCPUUsageMax = useCallback(() =>{
        let max:number|undefined = undefined;
        if(props.project.flavor.processor){
            // Format of processor is 1 vcore or 2 cores etc... a bit random
            const match = props.project.flavor.processor.match(/(\d+)\s+(\w+)/);
            if(match){
                max = parseInt(match[1]);
            }
        }
        return max;
    }, [ props.project.flavor ])

    const getMemoryUsageMax = useCallback(() =>{
        let max:number|undefined = undefined;
        if(props.project.flavor.memory){
            // Format of memory is 2 Go or 4 Go etc...
            const match = props.project.flavor.memory.match(/(\d+)\s+(\w+)/);
            if(match){
                max = parseInt(match[1]);
            }
        }
        return max;
    }, [ props.project.flavor ])

    const getDiskUsageMax = useCallback(() =>{
        let max:number|undefined = undefined;
        if(props.project.flavor.storage){
            // Format of storage is 100 Go
            const match = props.project.flavor.storage.match(/(\d+)\s+(\w+)/);
            if(match){
                max = parseInt(match[1]);
            }
        }
        return max;
    }, [ props.project.flavor ])

    const getNetworkUsageMax = useCallback(() =>{
        let max:number|undefined = undefined;
        if(props.project.flavor.bandwidth){
            // Format of disk is 100 Mbits/s
            const match = props.project.flavor.bandwidth.match(/(\d+)\s+(\w+)/);
            if(match){
                max = parseInt(match[1]);
            }
        }
        return max;
    }, [ props.project.flavor ])

    

    return (
        <>
            {/* CPU Usage */}
            <div className="vm-monitoring-card">
                <div className="vm-monitoring-card-title">
                    CPU Usage (%)
                </div>
                <div className="vm-monitoring-card-content">
                    {
                        !cpuUsage 
                        ? <div className="no-data"> <Loading/> Loading CPU usage... </div>
                        : cpuUsage 
                            ? <>
                                {
                                    loadingCPUUsage &&
                                    <div className="vm-monitoring-card-content-loading">
                                        <Loading/> Loading CPU usage...
                                    </div>
                                }
                                <MonitoringChart data={cpuUsage}/>
                                <TimeRangeSelector
                                    options={TIME_RANGE_OPTIONS}
                                    value={cpuUsageTimeRange}
                                    onChange={setCpuUsageTimeRange}
                                />
                            </>
                            : <div className="no-data"> No CPU usage data to show </div>
                    }
                </div>
            </div>

            {/* Memory Usage */}
            <div className="vm-monitoring-card">
                <div className="vm-monitoring-card-title">
                    Memory Usage (%)
                </div>
                <div className="vm-monitoring-card-content">
                    {
                        !memoryUsage
                        ? <div className="no-data"> <Loading/> Loading Memory usage... </div>
                        : memoryUsage 
                            ? <>
                                {
                                    loadingMemoryUsage &&
                                    <div className="vm-monitoring-card-content-loading">
                                        <Loading/> Loading Memory usage...
                                    </div>
                                }
                                <MonitoringChart data={memoryUsage}/>
                                <TimeRangeSelector
                                    options={TIME_RANGE_OPTIONS}
                                    value={memoryUsageTimeRange}
                                    onChange={setMemoryUsageTimeRange}
                                />
                            </>
                            : <div className="no-data"> No Memory usage data to show </div>
                    }
                </div>
            </div>

            {/* Disk Usage */}
            <div className="vm-monitoring-card">
                <div className="vm-monitoring-card-title">
                    Disk Usage / (%)
                </div>
                <div className="vm-monitoring-card-content">
                    {
                        !diskUsage
                        ? <div className="no-data"> <Loading/> Loading Disk usage /... </div>
                        : diskUsage 
                            ? <>
                                {
                                    loadingDiskUsage &&
                                    <div className="vm-monitoring-card-content-loading">
                                        <Loading/> Loading Disk usage /...
                                    </div>
                                }
                                <MonitoringChart data={Object.values(diskUsage)[0]}/>
                                <TimeRangeSelector
                                    options={TIME_RANGE_OPTIONS}
                                    value={diskUsageTimeRange}
                                    onChange={setDiskUsageTimeRange}
                                />
                            </>
                            : <div className="no-data"> No Disk usage data to show </div>
                    }
                </div>
            </div>
            <div className="vm-monitoring-card">
                <div className="vm-monitoring-card-title">
                    Disk Usage /mount/data (%)
                </div>
                <div className="vm-monitoring-card-content">
                    {
                        !diskUsage
                        ? <div className="no-data"> <Loading/> Loading Disk usage /mount/data... </div>
                        : diskUsage 
                            ? <>
                                {
                                    loadingDiskUsage &&
                                    <div className="vm-monitoring-card-content-loading">
                                        <Loading/> Loading Disk usage /mount/data...
                                    </div>
                                }
                                <MonitoringChart data={Object.values(diskUsage)[1]}/>
                                <TimeRangeSelector
                                    options={TIME_RANGE_OPTIONS}
                                    value={diskUsageTimeRange}
                                    onChange={setDiskUsageTimeRange}
                                />
                            </>
                            : <div className="no-data"> No Disk usage data to show </div>
                    }
                </div>
            </div>

            {/* Network Usage */}
            <div className="vm-monitoring-card">
                <div className="vm-monitoring-card-title">
                    Network usage recieved (bytes/s)
                </div>
                <div className="vm-monitoring-card-content">
                    {
                        !networkUsage
                        ? <div className="no-data"> <Loading/> Loading Network usage recieved... </div>
                        : networkUsage 
                            ? <>
                                {
                                    loadingNetworkUsage &&
                                    <div className="vm-monitoring-card-content-loading">
                                        <Loading/> Loading Network usage recieved...
                                    </div>
                                }
                                <MonitoringChart data={Object.values(networkUsage)[0]} 
                                    // max={getNetworkUsageMax()}
                                    noPercentage
                                />
                                <TimeRangeSelector
                                    options={TIME_RANGE_OPTIONS}
                                    value={networkUsageTimeRange}
                                    onChange={setNetworkUsageTimeRange}
                                />
                            </>
                            : <div className="no-data"> No Network usage recieved data to show </div>
                    }
                </div>
            </div>
            <div className="vm-monitoring-card">
                <div className="vm-monitoring-card-title">
                    Network usage transmitted (bytes/s)
                </div>
                <div className="vm-monitoring-card-content">
                    {
                        !networkUsage
                        ? <div className="no-data"> <Loading/> Loading Network usage transmitted... </div>
                        : networkUsage 
                            ? <>
                                {
                                    loadingNetworkUsage &&
                                    <div className="vm-monitoring-card-content-loading">
                                        <Loading/> Loading Network usage transmitted...
                                    </div>
                                }
                                <MonitoringChart data={Object.values(networkUsage)[1]} 
                                    // max={getNetworkUsageMax()}
                                    noPercentage
                                />
                                <TimeRangeSelector
                                    options={TIME_RANGE_OPTIONS}
                                    value={networkUsageTimeRange}
                                    onChange={setNetworkUsageTimeRange}
                                />
                            </>
                            : <div className="no-data"> No Network usage transmitted data to show </div>
                    }
                </div>
            </div>

        </>
    )
}

const TimeRangeSelector = (props: {
    options: { label: string, value: number }[],
    value: number, 
    onChange: (value: number) => void,
})=>{
    return (
        <div className="vm-monitoring-time-range-selector">
            {
                props.options.map((option)=>(
                    <div 
                        key={option.value}
                        className={classNames({
                            "vm-monitoring-time-range-selector-option": true,
                            "selected": props.value === option.value
                        })}
                        onClick={()=>props.onChange(option.value)}
                    >
                        {option.label}
                    </div>
                ))  
            }
        </div>
    )
};

const MonitoringChart = (props: { 
    data: IMetricValue, 
    max?: number, 
    noPercentage?: boolean,
}) =>{

    const option = useMemo<EChartsOption>(()=>{
        // Need to add 20% to max
        let max = props.max ? props.max * 1.2 : !props.noPercentage ? 100 : undefined;
        return {
            textStyle: {
                color: '#ffffff'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            tooltip: {
                trigger: 'axis',
                // formatter: '{b}: {c} {d}'
            },
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : props.data.data.map((item)=>dayjs(item.timestamp * 1000).format('MM-DD HH:mm')),
                    axisLabel: {
                        rotate: 45,
                        fontSize: 11,
                        fontWeight: 'bold'
                    }
                }
            ],
            yAxis : [
                {
                    type: 'value',
                    max
                }
            ],
            series : [
                {
                    name:props.data.name,
                    type:'line',
                    areaStyle: {normal: {}},
                    data: props.data.data.map((item)=>item.value),
                    markLine: props.max ? {
                        data: [
                            { yAxis: props.max, },
                        ],
                        lineStyle: {
                            color: 'red',
                            type: 'solid',
                            width: 2
                        },
                        symbol: 'none',
                        label: {
                            show: true,
                            position: 'end',
                            formatter: 'Max'
                        }
                    } : undefined
                },
            ]
        }
    }, [props.data])
    return ( 
        <ReactECharts
            option={option}
            style={{ height: 300 }}
        />
    )
    
}