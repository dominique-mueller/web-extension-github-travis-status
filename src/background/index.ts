import { TravisCiClient } from './travis-ci/travis-ci.client';
import { TravisCiStages } from './travis-ci/travis-ci.interfaces';

console.log( 'RUNNING BACKGROUND!' );

// Listen to navigation changes within GitHub itself
chrome.webNavigation.onHistoryStateUpdated.addListener( ( details: chrome.webNavigation.WebNavigationTransitionCallbackDetails ): void => {
    if ( /github\.com\/.*\/pull\/.*/.test( details.url ) ) {
        chrome.tabs.executeScript( null, {
            file: 'src/content_script.js'
        } );
    }
} );

const travisCiClient: TravisCiClient = new TravisCiClient();
travisCiClient
    .fetchBuildStagesWithJobs( 360312950 )
    .then( ( result: TravisCiStages ) => {
        console.log( result );
    } );
