import { IProject } from "@desp-aas/desp-ui-fwk/src/utils/types";

export const projects: IProject[] = [
    {
        name: 'Project-1',
        status: 'active',
        owner: 'pesquet',
        modificationDate: new Date('2024-09-26T12:54:00'),
        creationDate: new Date('2024-09-25T15:23:00'),
        repository: 'https://github.com/nodeshift-starter',
        registry: 'https://github.com/nodeshift-starter',
        members: [
            'louis.kleverman'
        ],
        resourceType: 'advanced-1'
    }
]

export default projects;