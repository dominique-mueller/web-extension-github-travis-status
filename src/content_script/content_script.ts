import { TravisCiStatus } from './travis-ci-status';
import { TravisCiStages } from 'background/travis-ci/travis-ci.interfaces';

// Content Script

console.log( 'CONTENT SCRIPT RUNNING' );

function requestBuildDetails( buildId: number ): Promise<TravisCiStages> {
    return new Promise( ( resolve: ( stages: TravisCiStages ) => void, reject: () => void ) => {
        chrome.runtime.sendMessage( {
            buildId
        }, ( response: TravisCiStages ) => {
            resolve( response );
        } );
    } );
}


export class ContentScript {

    private intervalToken: number;

    public async init() {

        // Setup
        const mergeStatusItem: HTMLDivElement = <HTMLDivElement>document
            .querySelector( '.mergeability-details a.status-actions[href^="https://travis-ci.org/"]' )
            .closest( 'div.merge-status-item' );
        const travisCiStatus: TravisCiStatus = new TravisCiStatus( mergeStatusItem );

        // Initial rendering
        const travisCiStages: TravisCiStages = await requestBuildDetails( travisCiStatus.buildId );
        travisCiStatus.renderDetailedTravisCiStatus( travisCiStages.stages );
        travisCiStatus.fixMergeStatusCheckToggle();

        // Update rendering
        this.intervalToken = setInterval( async() => {
            const travisCiStages: TravisCiStages = await requestBuildDetails( travisCiStatus.buildId );
            if ( this.intervalToken ) { // Cancel if interval got reset
                travisCiStatus.renderDetailedTravisCiStatus( travisCiStages.stages );
            }
        }, 5000 );
    }

    public cleanup() {
        clearInterval( this.intervalToken );
        this.intervalToken = undefined;
    }

}

const contentScript: ContentScript = new ContentScript();

const mutationObserver: MutationObserver = new MutationObserver( ( mutations: any ) => {
    console.log( mutations );
    reset();
} );

const reset: () => void = debounce( () => {
    console.log( 'RESET' );
    contentScript.cleanup();
    contentScript.init();
}, 5000 );

chrome.runtime.onMessage.addListener( async( message: any ) => {
    if ( message.type === 'navigation' && message.isGithubPullRequestPage ) {

        mutationObserver.observe( document.querySelector( '#partial-pull-merging' ).parentElement, {
            childList: true
        } );
        contentScript.init();

    } else {

        mutationObserver.disconnect();
        contentScript.cleanup();

    }
} );

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce( func, wait, immediate? ) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if ( !immediate ) func.apply( context, args );
        };
        var callNow = immediate && !timeout;
        clearTimeout( timeout );
        timeout = setTimeout( later, wait );
        if ( callNow ) func.apply( context, args );
    };
};
