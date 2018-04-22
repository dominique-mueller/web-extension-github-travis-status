import { TravisCiClient } from './travis-ci/travis-ci.client';
import { TravisCiStages } from './travis-ci/travis-ci.interfaces';

const travisCiClient: TravisCiClient = new TravisCiClient();

// Answer requests for Travis CI buiild information
chrome.runtime.onMessage.addListener( ( request: any, sender: chrome.runtime.MessageSender, sendResponse: ( response: any ) => void ) => {
    travisCiClient
        .fetchBuildStagesWithJobs( request.buildId )
        .then( ( travisCiStages: TravisCiStages ) => {
            console.log( travisCiStages );
            sendResponse( travisCiStages );
        } );
    return true; // Asynchronous response
} );

// Listen to navigation changes within GitHub itself, send information to content script
chrome.webNavigation.onCompleted.addListener( onNavigation ); // Initial navigation
chrome.webNavigation.onHistoryStateUpdated.addListener( onNavigation ); // Further navigations
function onNavigation( details: chrome.webNavigation.WebNavigationTransitionCallbackDetails ) {
    chrome.tabs.sendMessage( details.tabId, {
        type: 'navigation',
        isGithubPullRequestPage: /^https:\/\/github\.com\/.+\/.+\/pull\/\d+$/.test( details.url )
    } );
}
