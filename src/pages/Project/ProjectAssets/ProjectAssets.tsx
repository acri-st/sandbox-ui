import { ReactNode, useCallback, useEffect, useState } from "react";
import { IProjectSectionProps } from "../Project";
import { FaCogs, FaPlus, FaSyncAlt, FaTimes } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import './ProjectAssets.css';
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import { LuFolderGit2 } from "react-icons/lu";
import { despURLS, FWKIcons, getAssets, getBookmarks, getCategories, getUserAssets, Table, Tabs, useUser } from "@desp-aas/desp-ui-fwk";
import { ASSET_STATUS, IAsset, ICategory } from "@desp-aas/desp-ui-fwk/src/utils/types";
dayjs.extend(relativeTime);



export const ProjectAssets = (props: IProjectSectionProps) => {
    const [ tab, setTab ] = useState('user_assets');
    const [ loadingCategories, setLoadingCategories ] = useState(false);
    const [ categories, setCategories ] = useState<ICategory[]>([]);
    const [ loadingUserAssets, setLoadingUserAssets ] = useState(true);
    const [ userAssets, setUserAssets ] = useState<IAsset[]>([]);
    const [ loadingBookmarkAssets, setLoadingBookmarkAssets ] = useState(true);
    const [ bookmarkAssets, setBookmarkAssets ] = useState<IAsset[]>([]);

    const user = useUser();

    useEffect(()=>{
        fetchCategories()
    }, [])
    useEffect(()=>{
        if(!loadingCategories){
            fetchAssets();
            fetchBookmarkAssets();
        }
    }, [loadingCategories])

    const fetchCategories = useCallback(()=>{
        setLoadingCategories(true);
        getCategories()
        .then((categories)=>{
            setCategories(categories) 
        })
        .finally(()=>{
            setLoadingCategories(false);
        })
    }, [])
    
    const formatAsset = (asset: IAsset) =>{
        const category = categories.find((category)=> category.id === asset.categoryId);
        return {
            ...asset,
            category: category ? category.name : asset.categoryId,
            // metadata: {
            //     ...asset.metadata,
            //     description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at tempus orci. Integer id neque nec dolor luctus tristique a quis enim. Cras eget lobortis urna, id cursus dui. Aliquam laoreet quam ut nulla fermentum, nec congue mi iaculis. Aliquam bibendum, tortor ut hendrerit vestibulum, dolor orci rhoncus lorem, a scelerisque dolor erat ut nulla. Duis ullamcorper neque sem, eu semper mauris dignissim a. Nunc gravida suscipit purus at vestibulum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum eget fermentum metus. Aliquam erat volutpat. Nulla tincidunt dolor ante, vitae accumsan nunc facilisis eu. Vivamus erat dolor, hendrerit at est eget, sollicitudin semper justo. Mauris ullamcorper ac arcu id sagittis.`
            // }
        }
    }

    const fetchAssets = useCallback(()=>{
        if(user){
            setLoadingUserAssets(true);
            getUserAssets(user.username)
            .then((assets)=>{
                setUserAssets(
                    assets.filter((asset)=> 
                        asset.type === 'dataset' && asset.source === "user"
                        && asset.status && [ASSET_STATUS.published].includes(asset.status)
                    )
                    .map(formatAsset)
                ) 
                console.log(userAssets)
            })
            .finally(()=>{
                setLoadingUserAssets(false);
            })
        }
    }, [loadingCategories])
    const fetchBookmarkAssets = useCallback(()=>{
        if(user){
            setLoadingBookmarkAssets(true);
            getBookmarks()
            .then((assets)=>{
                setBookmarkAssets(
                    assets.filter((asset)=> asset.type === 'dataset')
                    .map(formatAsset)
                ) 
            })
            .finally(()=>{
                setLoadingBookmarkAssets(false);
            })
        }
    }, [loadingCategories])

    return (
        <>
            <div id="assets-content">
                <Tabs 
                    selected={tab}
                    onSelect={setTab}
                    tabs={[
                        { label: 'My Assets', path: 'user_assets' },
                        { label: 'Bookmarked assets', path: 'bookmarked_assets' },
                    ]}
                />
                <div id="assets-list" className="sub-section">
                    <Table
                        loading={tab === 'user_assets' ? loadingUserAssets : loadingBookmarkAssets}
                        // onRowClick={(row)=> window.open(`${despURLS.collaborative}/asset/${row.id}`, '_blank')}
                        headers={[
                            { label: 'Name', field: 'name', type: 'text' },
                            // { label: 'Source', field: 'source', type: 'text' },
                            { label: 'Category', field: 'category', type: 'text', },
                            { 
                                label: 'Type', field: 'type', type: 'text', 
                                fieldGetValue: (row)=> row.metadata?.type || '',
                                format: (row)=> row.metadata?.type,
                            },
                            {
                                label: 'Description', field: 'description', type: 'text',
                                fieldGetValue: (row)=> row.metadata?.description || '',
                                format: (row)=> row.metadata?.description,
                            }
                            // { 
                            //     label: 'Date', field: 'date', type: 'date', 
                            //     format: (row)=> dayjs(row.date).fromNow()
                            // },
                        ]}
                        operations={(row)=>(
                            <a 
                                className="button small blue operation icon-only"
                                href={`${despURLS.collaborative}/asset/${row.id}`}
                                target="_blank"
                            >
                                { FWKIcons.externalLink }
                            </a>
                        )}
                        rows={tab === 'user_assets' ? userAssets : bookmarkAssets }
                        fieldGetValue={{
                            type: (row)=> row.metadata?.type
                        }}
                    />
                </div>
                {/* <div id="assets-list" className="sub-section">
                    <div id="assets-list-topbar">
                        <h3>Project assets:</h3>
                        <div className="button medium">
                            <FaPlus/> New asset
                        </div>
                    </div>
                    <div id="assets-list-container">
                        <div id="assets-list-icon">
                            <LuFolderGit2  />
                        </div>

                        <div id="assets-list-table">
                            <Table
                                headers={[
                                    { label: 'Name', field: 'name', type: 'text' },
                                    { label: 'Size', field: 'size', type: 'text' },
                                    { 
                                        label: 'Date', field: 'date', type: 'date', 
                                        format: (row)=> dayjs(row.date).fromNow()
                                    },
                                ]}
                                rows={[
                                    { name: '.gitattributes', size: '2.37 kB', date: '2024-09-12T00:15' },
                                    { name: '.gitattributes', size: '2.37 kB', date: '2024-09-11T00:15' },
                                    { name: '.gitattributes', size: '2.37 kB', date: '2024-09-10T00:15' },
                                    { name: '.gitattributes', size: '2.37 kB', date: '2024-09-09T00:15' },
                                    { name: '.gitattributes', size: '2.37 kB', date: '2024-09-08T00:15' },
                                    { name: '.gitattributes', size: '2.37 kB', date: '2024-09-07T00:15' },
                                    { name: '.gitattributes', size: '2.37 kB', date: '2024-09-06T00:15' },
                                    { name: '.gitattributes', size: '2.37 kB', date: '2024-09-05T00:15' },
                                    { name: '.gitattributes', size: '2.37 kB', date: '2024-09-04T00:15' },
                                    { name: '.gitattributes', size: '2.37 kB', date: '2024-09-03T00:15' },
                                    { name: '.gitattributes', size: '2.37 kB', date: '2024-09-02T00:15' },
                                    { name: '.gitattributes', size: '2.37 kB', date: '2024-09-01T00:15' },
                                ]}
                            />
                        </div>
                        
                    </div>
                </div> */}

            </div>
        </>
    )
}