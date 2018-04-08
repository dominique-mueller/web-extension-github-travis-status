import { TravisCiClient } from './travis-ci/travis-ci.client';
import { TravisCiStages } from './travis-ci/travis-ci.interfaces';

console.log( 'RUNNING BACKGROUND!' );

// Setup connection to content script
let contentScriptConnection: chrome.runtime.Port;
chrome.runtime.onConnect.addListener( ( port: chrome.runtime.Port ): void => {
    if ( port.name = 'content_script' ) {
        contentScriptConnection = port;

        const travisCiClient: TravisCiClient = new TravisCiClient();
        travisCiClient
            .fetchBuildStagesWithJobs( 363203151 )
            .then( ( result: TravisCiStages ) => {
                console.log( result );
                contentScriptConnection.postMessage( result );
            } );

    }
} );

// Listen to navigation changes within GitHub itself, send information to content script
chrome.webNavigation.onHistoryStateUpdated.addListener(
    ( details: chrome.webNavigation.WebNavigationTransitionCallbackDetails ): void => {
        if ( /^https:\/\/github\.com\/.+\/.+\/pull\/\d+(\/commits)?$/.test( details.url ) ) {
            if ( contentScriptConnection ) {
                contentScriptConnection.postMessage( {
                    type: 'navigation'
                } );
            }
        }
    }
);
