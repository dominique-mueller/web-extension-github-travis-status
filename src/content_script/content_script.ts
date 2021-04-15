import { TravisCiBuild } from 'background/travis-ci/travis-ci.interfaces';
import deepEqual from 'deep-equal';

import { TravisCiStatus } from './travis-ci-status';

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
  private travisCiBuild: TravisCiBuild;

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
  constructor(pollingInterval = 5000) {
    this.pollingInterval = pollingInterval;

    // Re-render every time the pull merging partial gets re-rendered
    this.pullMergingPartialMutationObserver = new MutationObserver((): void => {
      this.cleanup();
      this.init();
    });

    // Re-render on GitHub navigation
    chrome.runtime.onMessage.addListener(async (message: any) => {
      if (message.type === 'navigation' && message.isGithubPullRequestPage) {
        this.pullMergingPartialMutationObserver.observe(document.querySelector('#partial-pull-merging').parentElement, {
          childList: true,
        });
        this.init();
      } else {
        this.pullMergingPartialMutationObserver.disconnect();
        this.cleanup();
      }
    });
  }

  /**
   * Initialize
   */
  private async init() {
    // Setup
    const mergeStatusItem: HTMLDivElement = this.findMergeStatusItem();
    const travisCiStatus: TravisCiStatus = new TravisCiStatus(mergeStatusItem);

    // Initial rendering
    const hasFetchedBuildDetails = !!this.travisCiBuild;
    if (hasFetchedBuildDetails) {
      // Use 'cached' (aka previous) data if available
      travisCiStatus.renderDetailedTravisCiStatus(this.travisCiBuild);
      travisCiStatus.fixMergeStatusCheckToggle();
    }
    this.travisCiBuild = await this.fetchBuildDetails(travisCiStatus.buildId);
    travisCiStatus.renderDetailedTravisCiStatus(this.travisCiBuild);
    if (!hasFetchedBuildDetails) {
      travisCiStatus.fixMergeStatusCheckToggle();
    }

    // Polling w/ re-rendering
    this.intervalToken = window.setInterval(async () => {
      // Skip re-rendering if polling got canceled, or the fetched data brings no update to the table
      const travisCiBuildUpdated: TravisCiBuild = await this.fetchBuildDetails(travisCiStatus.buildId);
      if (this.intervalToken && !deepEqual(travisCiBuildUpdated, this.travisCiBuild, { strict: true })) {
        this.travisCiBuild = travisCiBuildUpdated;
        travisCiStatus.renderDetailedTravisCiStatus(this.travisCiBuild);
      }
    }, this.pollingInterval);
  }

  /**
   * Cleanup
   */
  private cleanup() {
    if (this.intervalToken) {
      clearInterval(this.intervalToken);
      this.intervalToken = undefined;
    }
  }

  /**
   * Request build details
   *
   * @param   buildId - Build ID
   * @returns         - Promise, resolving with Travis CI build details
   */
  private fetchBuildDetails(buildId: number): Promise<TravisCiBuild> {
    return new Promise((resolve: (stages: TravisCiBuild) => void) => {
      chrome.runtime.sendMessage(
        {
          buildId,
        },
        (response: TravisCiBuild) => {
          resolve(response);
        },
      );
    });
  }

  /**
   * Find our merge status item
   */
  private findMergeStatusItem(): HTMLDivElement {
    return <HTMLDivElement>(
      document.querySelector('.mergeability-details a.status-actions[href^="https://travis-ci.org/"]').closest('div.merge-status-item')
    );
  }
}

// Run
new ExtensionContentScript();
