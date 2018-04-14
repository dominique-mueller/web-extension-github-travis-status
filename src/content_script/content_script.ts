import { TravisCiStatus } from './travis-ci-status';

// Content Script

console.log( 'CONTENT SCRIPT RUNNING' );

// document.body.appendChild( document.createComment( 'CONTENT SRIPT MANIPULATION' ) );

const connectionPort: chrome.runtime.Port = chrome.runtime.connect( {
    name: 'content_script'
} );
connectionPort.onMessage.addListener( ( message: any ) => {

    console.log( message );

    const travisCiStatus: TravisCiStatus = new TravisCiStatus();
    travisCiStatus.enhanceTravisCiStatus( message.stages );

} );
