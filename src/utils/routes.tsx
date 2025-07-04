import { FWKIcons, IRoute } from "@desp-aas/desp-ui-fwk";

export const routes: IRoute[] = [
    { id: "home", path: "/", label: <>Home</> },
    { id: "projects", path: "/projects", label: "Projects" },
    // { id: "user_guides", path: "/user-guides", label: "User guides" },
    {
        id: "start-jupyter", label: <><span className="icon">{FWKIcons.jupyter}</span> Access JupyterLab</>,
        href: "https://code.insula.destine.eu/", target: "_blank"
    },
    { 
        id: "help",
        label: "Help",
        subroutes: [
            { id: "documentation", href: "/help/documentation/", label: "Documentation",  target: "_blank" }
        ]
    },
]