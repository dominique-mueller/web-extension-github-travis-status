import * as deepEqual from 'deep-equal';

import { TravisCiStatus } from './travis-ci-status';
import { TravisCiStages } from 'background/travis-ci/travis-ci.interfaces';

/**
 * Content Script
 */
export class ExtensionContentScript {

    /**
     * Interval token (used for cleanup)
     */
    private intervalToken: number;

    /**
     * Travis CI stages with jobs data
     */
    private travisCiStages: TravisCiStages;

    /**
     * Polling interval in ms
     */
    private readonly pollingInterval: number;

    /**
     * Mutation observer for the pull merging partial
     */
    private readonly pullMergingPartialMutationObserver: MutationObserver;

    /**
     * Constructor
     *
     * @param [pollingInterval=5000] - Polling interval
     */
    constructor( pollingInterval: number = 5000 ) {
        this.pollingInterval = pollingInterval;

        // Re-render every time the pull merging partial gets re-rendered
        this.pullMergingPartialMutationObserver = new MutationObserver( ( mutations: Array<MutationRecord> ): void => {
            this.cleanup();
            this.init();
        } );

        // Re-render on GitHub navigation
        chrome.runtime.onMessage.addListener( async ( message: any ) => {
            if ( message.type === 'navigation' && message.isGithubPullRequestPage ) {
                this.pullMergingPartialMutationObserver.observe( document.querySelector( '#partial-pull-merging' ).parentElement, {
                    childList: true
                } );
                this.init();
            } else {
                this.pullMergingPartialMutationObserver.disconnect();
                this.cleanup();
            }
        } );

    }

    /**
     * Initialize
     */
    private async init() {

        // Setup
        const mergeStatusItem: HTMLDivElement = this.findMergeStatusItem();
        const travisCiStatus: TravisCiStatus = new TravisCiStatus( mergeStatusItem );

        // Initial rendering
        const hasPreviousTravisCiStages: boolean = !!this.travisCiStages;
        if ( hasPreviousTravisCiStages ) { // Use 'cached' (aka previous) data if available
            travisCiStatus.renderDetailedTravisCiStatus( this.travisCiStages.stages );
            travisCiStatus.fixMergeStatusCheckToggle();
        }
        this.travisCiStages = await this.fetchBuildData( travisCiStatus.buildId );
        travisCiStatus.renderDetailedTravisCiStatus( this.travisCiStages.stages );
        if ( !hasPreviousTravisCiStages ) {
            travisCiStatus.fixMergeStatusCheckToggle();
        }

        // Polling w/ re-rendering
        this.intervalToken = setInterval( async () => {

            // Skip re-rendering if polling got canceled, or the fetched data brings no update to the table
            const travisCiStagesUpdated: TravisCiStages = await this.fetchBuildData( travisCiStatus.buildId );
            if ( this.intervalToken && !deepEqual( travisCiStagesUpdated, this.travisCiStages, { strict: true } ) ) {
                this.travisCiStages = travisCiStagesUpdated;
                travisCiStatus.renderDetailedTravisCiStatus( this.travisCiStages.stages );
            }

        }, this.pollingInterval );
    }

    /**
     * Cleanup
     */
    private cleanup() {
        if ( this.intervalToken ) {
            clearInterval( this.intervalToken );
            this.intervalToken = undefined;
        }
    }

    /**
     * Request build details
     *
     * @param   buildId - Build ID
     * @returns         - Promise, resolving with Travis CI stages incl. jobs
     */
    private fetchBuildData( buildId: number ): Promise<TravisCiStages> {
        return new Promise( ( resolve: ( stages: TravisCiStages ) => void, reject: () => void ) => {
            chrome.runtime.sendMessage( {
                buildId
            }, ( response: TravisCiStages ) => {
                resolve( response );
            } );
        } );
    }

    /**
     * Find our merge status item
     */
    private findMergeStatusItem(): HTMLDivElement {
        return <HTMLDivElement>document
            .querySelector( '.mergeability-details a.status-actions[href^="https://travis-ci.org/"]' )
            .closest( 'div.merge-status-item' );
    }

}

// Run
const contentScript: ExtensionContentScript = new ExtensionContentScript();
