/**
 * Travis CI Build Interface
 */
export interface TravisCiBuild {
  '@type': 'build';
  '@href': string;
  '@representation': 'standard';
  '@permissions': { [permission: string]: boolean };
  id: number;
  number: string;
  state: TravisCiState;
  duration: number;
  event_type: string;
  previous_state: string;
  pull_request_title: string;
  pull_request_number: number;
  started_at: string; // ISO format
  finished_at: string; // ISO format
  updated_at: string; // ISO format
  created_by: {
    '@type': 'user';
    '@href': string;
    '@representation': 'minimal';
    id: number;
    login: string;
  };
  repository: {
    '@type': 'repository';
    '@href': string;
    '@representation': 'minimal';
    id: number;
    name: string;
    slug: string;
  };
  branch: {
    '@type': 'branch';
    '@href': string;
    '@representation': 'minimal';
    name: string;
  };
  tag: null;
  commit: {
    '@type': 'commit';
    '@representation': 'minimal';
    id: number;
    sha: string;
    ref: string;
    message: string;
    compare_url: string;
    committed_at: string; // ISO format
  };
  jobs: Array<TravisCiJob>;
  stages: Array<TravisCiStage>;
}

/**
 * Travis CI Stage Interface
 */
export interface TravisCiStage {
  '@type': 'stage';
  '@representation': 'standard';
  id: number;
  number: number;
  name: string;
  state: TravisCiState;
  started_at: string; // ISO format
  finished_at: string; // ISO format
  jobs: Array<TravisCiJob>;
}

/**
 * Travis CI Job Interface
 */
export interface TravisCiJob {
  '@type': 'job';
  '@href': string;
  '@representation': 'minimal';
  id: number;
  number: string;
  state: TravisCiState;
  stage: TravisCiStage | null;
  started_at: string; // ISO format
  finished_at: string; // ISO format
}

/**
 * Travis CI State Type
 */
export type TravisCiState = 'received' | 'queued' | 'created' | 'started' | 'passed' | 'failed' | 'errored' | 'canceled';
