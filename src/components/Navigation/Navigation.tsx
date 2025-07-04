import { Navigation as _Navigation, FWKIcons } from "@desp-aas/desp-ui-fwk"
import { routes } from "../../utils/routes";


export function Navigation() {    
    return <_Navigation 
        routes={routes} 
        profileRoutes={[
            {
                id: "new_project", label: <>New project</>,
                path: "/projects/create"
            }
        ]}
    />
}