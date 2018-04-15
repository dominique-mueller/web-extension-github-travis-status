import { TravisCiStatus } from './travis-ci-status';

// Content Script

console.log( 'CONTENT SCRIPT RUNNING' );

// document.body.appendChild( document.createComment( 'CONTENT SRIPT MANIPULATION' ) );

const connectionPort: chrome.runtime.Port = chrome.runtime.connect( {
    name: 'content_script'
} );
connectionPort.onMessage.addListener( ( message: any ) => {

    const mergeStatusItem: HTMLDivElement = <HTMLDivElement> document
        .querySelector( '.mergeability-details a.status-actions[href^="https://travis-ci.org/"]' )
        .closest( 'div.merge-status-item' );

    const travisCiStatus: TravisCiStatus = new TravisCiStatus( mergeStatusItem );
    travisCiStatus.enhanceTravisCiStatus( message.stages );

} );
