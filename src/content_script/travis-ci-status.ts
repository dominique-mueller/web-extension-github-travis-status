import { TravisCiStage, TravisCiJob } from 'background/travis-ci/travis-ci.interfaces';
import { octicons } from './octicons';

/**
 * Travis CI Status
 */
export class TravisCiStatus {

    /**
     * Build ID
     */
    private readonly buildId: number;

    /**
     * Travis CI project URL
     */
    private readonly travisCiProjectUrl: string;

    /**
     * Travis CI link query params
     */
    private readonly travisCiLinkQueryParams: string;

    /**
     * Status item element
     */
    private readonly statusItemElement: HTMLDivElement;

    /**
     * State icons (state -> SVG path)
     */
    private readonly stateIcons: { [ status: string ]: string };

    /**
     * Constructor
     *
     * @param statusItemElement - Status item element to enhance
     */
    constructor( statusItemElement: HTMLDivElement ) {
        this.statusItemElement = statusItemElement;

        // Get URLs
        const [ urlWithoutQueryParams, queryParams ]: Array<string> =
            ( <HTMLAnchorElement> this.statusItemElement.querySelector( 'a.status-actions[href^="https://travis-ci.org/"]' ) )
                .href
                .split( '?' );
        this.travisCiLinkQueryParams = `?${ queryParams }`;
        this.travisCiProjectUrl = urlWithoutQueryParams.split( '/' ).slice( 0, 5 ).join( '/' );
        this.buildId = parseInt( urlWithoutQueryParams.split( '/' ).slice( -1 )[ 0 ], 10 );

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

        // Create elements
        const statusDetailsElement: HTMLDivElement = this.createStatusDetailsElement( stagesWithJobs );
        const collapseButtonElement: HTMLButtonElement = this.createCollapseButton();

        // Insert into DOM
        this.statusItemElement.parentElement.insertBefore( statusDetailsElement, this.statusItemElement.nextElementSibling );
        this.statusItemElement.lastElementChild.previousElementSibling.appendChild( collapseButtonElement );

        // Setup event listeners
        this.setupCollapseButtonEventListeners( statusDetailsElement, collapseButtonElement );

    }

    /**
     * Setup collapse button event listeners
     *
     * @param statusDetailsElement  - Status details element
     * @param collapseButtonElement - Collapse button element
     */
    private setupCollapseButtonEventListeners( statusDetailsElement: HTMLDivElement, collapseButtonElement: HTMLButtonElement ): void {

        // Calculate dimensions, once (#perfmatters)
        const expandedHeight: number = statusDetailsElement.firstElementChild.getBoundingClientRect().height + 1; // + 1px border
        const expandedHeightPx: string = `${ expandedHeight }px`;
        const collapsedHeight: number = 0;
        const collapsedHeightPx: string = `${ collapsedHeight }px`;
        const mergeStatusListExpandedHeight: number = expandedHeight + 215;
        const mergeStatusListExpandedHeightPx: string = `${ mergeStatusListExpandedHeight }px`;

        // Setup event listeners
        collapseButtonElement.addEventListener( 'click', () => {
            collapseButtonElement.classList.toggle( 'is-active' );
            if ( statusDetailsElement.style.maxHeight === collapsedHeightPx ) {
                statusDetailsElement.style.maxHeight = expandedHeightPx
                this.statusItemElement.parentElement.style.maxHeight = mergeStatusListExpandedHeightPx
            } else {
                statusDetailsElement.style.maxHeight = collapsedHeightPx
                this.statusItemElement.parentElement.style.maxHeight = ''; // Reset
            }
        } );

    }

    /**
     * Create collapse button
     *
     * @returns - Button DOM element
     */
    private createCollapseButton(): HTMLButtonElement {

        // Button
        const buttonElement: HTMLButtonElement = document.createElement( 'button' );
        buttonElement.type = 'button';
        buttonElement.classList.add( 'label', 'Label--gray', 'extension__button' );
        // buttonElement.innerText = 'Details';

        // Button icon
        const buttonIconElement: SVGElement = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
        buttonIconElement.classList.add( 'extension__icon', 'extension__icon--collapse' );
        buttonIconElement.setAttribute( 'viewBox', '0 0 12 16' );
        buttonIconElement.setAttribute( 'width', '12' );
        buttonIconElement.setAttribute( 'height', '10' );
        buttonIconElement.innerHTML = octicons.chevronDown;
        buttonElement.appendChild( buttonIconElement );

        return buttonElement;

    }

    /**
     * Create status details document fragment
     *
     * @param   stages - Stages
     * @returns        - Merge status details DOM element
     */
    private createStatusDetailsElement( stages: Array<TravisCiStage> ): HTMLDivElement {

        // Create extended merge status
        const statusItemElement: HTMLDivElement = document.createElement( 'div' );
        statusItemElement.classList.add( 'merge-status-item', 'extension__details' );
        statusItemElement.style.maxHeight = '0px';

        // Create stages
        const stagesElement: HTMLUListElement = this.createStagesElement( stages );
        statusItemElement.appendChild( stagesElement );

        return statusItemElement;

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
        stageHeadingElement.classList.add( 'extension__stage-heading', 'd-flex', 'flex-items-baseline' );
        stageElement.appendChild( stageHeadingElement );

        // Stage status
        const stageStatusElement: HTMLDivElement = document.createElement( 'div' );
        stageStatusElement.classList.add( 'extension__stage-status', 'flex-self-center' );
        this.addTooltipToElement( stageStatusElement, stage.state );
        stageHeadingElement.appendChild( stageStatusElement );

        // Stage status icon
        const stageStatusIconElement: SVGElement = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
        stageStatusIconElement.classList.add( 'extension__icon', `extension__icon--${ stage.state }` );
        stageStatusIconElement.setAttribute( 'viewBox', '0 0 12 16' );
        stageStatusIconElement.setAttribute( 'width', '12' );
        stageStatusIconElement.setAttribute( 'height', '10' );
        stageStatusIconElement.innerHTML = this.stateIcons[ stage.state ];
        stageStatusElement.appendChild( stageStatusIconElement );

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
        jobElement.classList.add( 'extension__job', 'd-flex', 'flex-items-baseline' );

        // Job status
        const jobStatusElement: HTMLDivElement = document.createElement( 'div' );
        jobStatusElement.classList.add( 'extension__job-status', 'flex-self-center' );
        this.addTooltipToElement( jobStatusElement, job.state );
        jobElement.appendChild( jobStatusElement );

        // Job icon
        const jobStatusIconElement: SVGElement = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
        jobStatusIconElement.classList.add( 'extension__icon', `extension__icon--${ job.state }` );
        jobStatusIconElement.setAttribute( 'viewBox', '0 0 12 16' );
        jobStatusIconElement.setAttribute( 'width', '12' );
        jobStatusIconElement.setAttribute( 'height', '10' );
        jobStatusIconElement.innerHTML = this.stateIcons[ job.state ];
        jobStatusElement.appendChild( jobStatusIconElement );

        // Job name (number)
        const jobNumberElement: HTMLElement = document.createElement( 'strong' );
        jobNumberElement.classList.add( 'extension__job-number' );
        jobNumberElement.classList.add( 'text-emphasized' );
        jobNumberElement.innerText = `#${ job.number }`;
        jobElement.appendChild( jobNumberElement );

        // Job runtime (similar to Travis CI)
        const [ jobMinutes, jobSeconds ]: Array<number> = this.calculateJobRuntime( job.started_at, job.finished_at );
        const jobRuntimeElement: HTMLSpanElement = document.createElement( 'span' );
        jobRuntimeElement.classList.add( 'label', 'Label--gray', 'extension__job-runtime' );
        jobRuntimeElement.innerHTML = `${ jobMinutes }&#8201;min&#8201;&#8201;${ jobSeconds }&#8201;sec`;
        jobElement.appendChild( jobRuntimeElement );

        // Job link
        const jobLinkElement: HTMLAnchorElement = document.createElement( 'a' );
        jobLinkElement.href = `${ [ this.travisCiProjectUrl, 'jobs', job.id.toString() ].join( '/' ) }${ this.travisCiLinkQueryParams }`;
        jobLinkElement.target = '_blank';
        jobLinkElement.innerText = 'View log';
        jobElement.appendChild( jobLinkElement );

        return jobElement;

    }

    /**
     * Add tooltip to element
     *
     * @param element     - Element
     * @param tooltipText - Tooltip tex
     */
    private addTooltipToElement( element: HTMLElement, tooltipText: string ): void {
        element.classList.add( 'tooltipped', 'tooltipped-e' );
        element.setAttribute( 'aria-label', tooltipText );
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

}
