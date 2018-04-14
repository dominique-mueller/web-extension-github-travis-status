import { TravisCiStage, TravisCiJob } from 'background/travis-ci/travis-ci.interfaces';
import { octicons } from './octicons';

/**
 * Travis CI Status
 */
export class TravisCiStatus {

    /**
     * Build URL
     */
    public readonly buildUrl: string;

    /**
     * Build ID
     */
    public readonly buildId: string;

    /**
     * List of status details links (DOM elements)
     */
    private readonly statusDetailsLinks: Array<HTMLAnchorElement>;

    /**
     * List of status items (DOM elements)
     */
    private readonly statusItems: Array<HTMLDivElement>;

    /**
     * Status
     */
    private readonly stateIcons: { [ status: string ]: string };

    /**
     * Constructor
     */
    constructor() {
        this.statusDetailsLinks = this.getStatusDetailsLinks();
        this.statusItems = this.getStatusItems( this.statusDetailsLinks );
        this.buildUrl = this.statusDetailsLinks[ 0 ].href;
        this.buildId = this.getBuildId( this.buildUrl );
        this.stateIcons = {
            canceled: octicons.circleSlash,
            created: octicons.primitiveDot,
            errored: octicons.x,
            failed: octicons.alert,
            passed: octicons.check,
            started: octicons.primitiveDot,
        };
    }

    /**
     * Enhance Travis CI status
     *
     * @param stagesWithJobs - Stages with jobs
     */
    public enhanceTravisCiStatus( stagesWithJobs: Array<TravisCiStage> ): void {

        // Create status details fragment, once
        const statusDetailsFragment: DocumentFragment = this.createStatusDetailsFragment( stagesWithJobs );

        // Append status information to document, cloned
        this.statusItems.forEach( ( statusItem: HTMLDivElement ): void => {
            statusItem.parentElement.insertBefore( statusDetailsFragment.cloneNode( true ), statusItem.nextElementSibling );
        } );

    }

    /**
     * Create status details document fragment
     *
     * @param   stages - Stages
     * @returns        - Document fragment
     */
    private createStatusDetailsFragment( stages: Array<TravisCiStage> ): DocumentFragment {

        const fragment: DocumentFragment = document.createDocumentFragment();

        // Create additional status item elements
        const statusItemElement: HTMLDivElement = document.createElement( 'div' );
        statusItemElement.classList.add( 'merge-status-item', 'extension__details' );
        const stagesElement: HTMLUListElement = this.createStagesElement( stages );
        statusItemElement.appendChild( stagesElement );

        fragment.appendChild( statusItemElement );
        return fragment;

    }

    /**
     * Creates stages element
     *
     * @param   stages - Stages
     * @returns        - Stages DOM element (ul)
     */
    private createStagesElement( stages: Array<TravisCiStage> ): HTMLUListElement {

        // Stages
        const stagesElement: HTMLUListElement = document.createElement( 'ul' );
        stagesElement.classList.add( 'extension__stages' );

        // Single stages
        stages.forEach( ( stage: TravisCiStage ): void => {
            const stageElement: HTMLLIElement = this.createStageElement( stage );
            stagesElement.appendChild( stageElement );
        } );

        return stagesElement;

    }

    /**
     * Create stage element
     *
     * @param   stage - Stage
     * @returns       - Stage DOM element (li)
     */
    private createStageElement( stage: TravisCiStage ): HTMLLIElement {

        // Stage
        const stageElement: HTMLLIElement = document.createElement( 'li' );
        stageElement.classList.add( 'extension__stage' );

        // Stage heading
        const stageHeadingElement: HTMLDivElement = document.createElement( 'div' );
        stageHeadingElement.classList.add( 'extension__stage-heading', 'd-flex' );
        stageElement.appendChild( stageHeadingElement );

        // Stage status icon
        const stageStatusIconElement: SVGElement = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
        stageStatusIconElement.classList.add( 'extension__icon', `extension__icon--${ stage.state }` );
        stageStatusIconElement.setAttribute( 'viewBox', '0 0 12 16' );
        stageStatusIconElement.setAttribute( 'width', '12' );
        stageStatusIconElement.setAttribute( 'height', '10' );
        stageStatusIconElement.innerHTML = this.stateIcons[ stage.state ];
        stageHeadingElement.appendChild( stageStatusIconElement );

        // Stage name
        const stageNameElement: HTMLElement = document.createElement( 'strong' );
        stageNameElement.classList.add( 'text-emphasized', 'extension__stage-name' );
        stageNameElement.innerText = stage.name;
        stageHeadingElement.appendChild( stageNameElement );

        const jobsElement: HTMLUListElement = this.createJobsElement( stage.jobs );
        stageElement.appendChild( jobsElement );

        return stageElement;

    }

    /**
     * Create jobs element
     *
     * @param   jobs - Jobs
     * @returns      - Jobs DOM element (ul)
     */
    private createJobsElement( jobs: Array<TravisCiJob> ): HTMLUListElement {

        // Jobs
        const jobsElement: HTMLUListElement = document.createElement( 'ul' );
        jobsElement.classList.add( 'extension__jobs' );

        // Single jobs
        jobs.forEach( ( job: TravisCiJob ): void => {
            const jobElement: HTMLLIElement = this.createJobElement( job );
            jobsElement.appendChild( jobElement );
        } );

        return jobsElement;

    }

    /**
     * Create job element
     *
     * @param   job - Job
     * @returns     - Job DOM element (li)
     */
    private createJobElement( job: TravisCiJob ): HTMLLIElement {

        // Job
        const jobElement: HTMLLIElement = document.createElement( 'li' );
        jobElement.classList.add( 'extension__job', 'd-flex' );

        // Job icon
        const jobStatusIconElement: SVGElement = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
        jobStatusIconElement.classList.add( 'extension__icon', `extension__icon--${ job.state }` );
        jobStatusIconElement.setAttribute( 'viewBox', '0 0 12 16' );
        jobStatusIconElement.setAttribute( 'width', '12' );
        jobStatusIconElement.setAttribute( 'height', '10' );
        jobStatusIconElement.innerHTML = this.stateIcons[ job.state ];
        jobElement.appendChild( jobStatusIconElement );

        // Job name (number)
        const jobNumberElement: HTMLElement = document.createElement( 'strong' );
        jobNumberElement.classList.add( 'extension__job-number' );
        jobNumberElement.classList.add( 'text-emphasized' );
        jobNumberElement.innerText = `#${ job.number }`;
        jobElement.appendChild( jobNumberElement );

        // Job runtime
        const [ jobMinutes, jobSeconds ]: Array<number> = this.calculateJobRuntime( job.started_at, job.finished_at );
        const jobRuntimeElement: HTMLSpanElement = document.createElement( 'span' );
        jobRuntimeElement.classList.add( 'label', 'Label--gray', 'extension__job-runtime' );
        jobRuntimeElement.innerText = `${ jobMinutes } min ${ jobSeconds } sec`; // Similar to how Travis CI displays the runtime
        jobElement.appendChild( jobRuntimeElement );

        // Job link
        const jobLinkElement: HTMLAnchorElement = document.createElement( 'a' );
        jobLinkElement.href = '#'; // TODO: Create link + query params
        jobLinkElement.innerText = 'View log';
        jobElement.appendChild( jobLinkElement );

        return jobElement;

    }

    /**
     * Calculate job runtime in minutes & seconds
     *
     * Implementation inspired by <https://stackoverflow.com/questions/3733227/javascript-seconds-to-minutes-and-seconds>
     *
     * @param startTime - Start time (ISO format)
     * @param endTime   - End time (ISO format)
     * @returns         - List of numbers, first item as minutes and second item as seconds
     */
    private calculateJobRuntime( startTime: string, endTime: string ): Array<number> {
        const runtime: number = ( ( new Date( endTime ) ).getTime() - ( new Date( startTime ) ).getTime() ) / 1000;
        const runtimeInMinutes: number = Math.floor( runtime / 60 );
        const runtimeInSeconds: number = runtime - runtimeInMinutes * 60;
        return [ runtimeInMinutes, runtimeInSeconds ];
    }

    /**
     * Get status details links
     */
    private getStatusDetailsLinks(): Array<HTMLAnchorElement> {
        return Array.from( document.querySelectorAll( 'a.status-actions[href^="https://travis-ci.org/"]' ) );
    }

    /**
     * Get status items
     *
     * @param statusDetailsLinks - Status details links
     */
    private getStatusItems( statusDetailsLinks: Array<HTMLAnchorElement> ): Array<HTMLDivElement> {
        return statusDetailsLinks
            .map( ( statusDetailsLink: HTMLAnchorElement ): HTMLDivElement => {
                return <HTMLDivElement>statusDetailsLink.closest( 'div.merge-status-item' );
            } );
    }

    /**
     * Get build ID
     *
     * @param buildUrl - Build URL
     */
    private getBuildId( buildUrl: string ): string {
        return buildUrl
            .split( '?' )[ 0 ]
            .split( '/' )
            .slice( -1 )[ 0 ];
    }

}
