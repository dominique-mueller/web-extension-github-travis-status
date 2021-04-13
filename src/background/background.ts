import { TravisCiClient } from './travis-ci/travis-ci.client';
import { TravisCiBuild } from './travis-ci/travis-ci.interfaces';

/**
 * Background
 */
export class ExtensionBackground {
  /**
   * Travis CI client
   */
  private readonly travisCiClient: TravisCiClient;

  /**
   * Constructor
   */
  constructor() {
    this.travisCiClient = new TravisCiClient();

    // Setup content script communication
    chrome.runtime.onMessage.addListener(this.handleContentScriptRequest.bind(this));

    // Notify content script about navigation changes, triggering re-rendering and / or cleanup actions
    chrome.webNavigation.onCompleted.addListener(this.handleGithubNavigation.bind(this)); // Initial navigation
    chrome.webNavigation.onHistoryStateUpdated.addListener(this.handleGithubNavigation.bind(this)); // Further navigations
  }

  /**
   * Handle content script request
   *
   * @param   request      - Request data
   * @param   sender       - Reqeust sender (e.g. which tab)
   * @param   sendResponse - Send response callback function
   * @returns              - Nothing, or true if function is asynchronous
   */
  private handleContentScriptRequest(request: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void): boolean {
    this.travisCiClient.fetchBuildDetails(request.buildId).then((travisCiBuild: TravisCiBuild) => {
      sendResponse(travisCiBuild);
    });
    return true; // Asynchronous response
  }

  /**
   * Handle GitHub navigation
   *
   * @param details - Navigation details
   */
  private handleGithubNavigation(details: chrome.webNavigation.WebNavigationTransitionCallbackDetails): void {
    chrome.tabs.sendMessage(details.tabId, {
      type: 'navigation',
      isGithubPullRequestPage: this.isGithubPullRequestUrl(details.url),
    });
  }

  /**
   * Check if the given URL is a GitHub Pull Request URL
   *
   * @param   url - URL
   * @returns     - Flag, describing whether the URL is or is not a GitHub Pull Request URL
   */
  private isGithubPullRequestUrl(url: string): boolean {
    return /^https:\/\/github\.com\/.+\/.+\/pull\/\d+/.test(url);
  }
}

// Run
const background: ExtensionBackground = new ExtensionBackground();
