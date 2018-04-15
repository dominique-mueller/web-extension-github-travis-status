import { TravisCiStatus } from './travis-ci-status';
import { TravisCiStages } from 'background/travis-ci/travis-ci.interfaces';

// Content Script

console.log( 'CONTENT SCRIPT RUNNING' );
// document.body.appendChild( document.createComment( 'CONTENT SRIPT MANIPULATION' ) );

function requestBuildDetails( buildId: number ): Promise<TravisCiStages> {
    return new Promise( ( resolve: ( stages: TravisCiStages ) => void, reject: () => void ) => {
        chrome.runtime.sendMessage( {
            buildId
        }, ( response: TravisCiStages ) => {
            resolve( response );
        } );
    } );
}

let intervalToken: number;

chrome.runtime.onMessage.addListener( async( message: any ) => {

    console.log( 'CONTENT_SCRIPT MESSAGE' );
    console.log( message );

    if ( message.type === 'navigation' && message.isGithubPullRequestPage ) {

        try {

            const mergeStatusItem: HTMLDivElement = <HTMLDivElement>document
                .querySelector( '.mergeability-details a.status-actions[href^="https://travis-ci.org/"]' )
                .closest( 'div.merge-status-item' );

            const travisCiStatus: TravisCiStatus = new TravisCiStatus( mergeStatusItem );
            const travisCiStages: TravisCiStages = await requestBuildDetails( travisCiStatus.buildId );
            travisCiStatus.enhanceTravisCiStatus( travisCiStages.stages );
            travisCiStatus.addCollapseButton();
            intervalToken = setInterval( async() => {
                const travisCiStages: TravisCiStages = await requestBuildDetails( travisCiStatus.buildId );
                travisCiStatus.enhanceTravisCiStatus( travisCiStages.stages );
            }, 5000 );

        } catch ( error ) {
            // Not ready yet

            // Cleanup
            clearInterval( intervalToken );

        }

    } else {

        // Cleanup
        clearInterval( intervalToken );

    }

} );
