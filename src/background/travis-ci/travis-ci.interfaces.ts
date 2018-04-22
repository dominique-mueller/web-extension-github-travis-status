/**
 * Travis CI Stages Interface
 */
export interface TravisCiStages {
    '@type': 'stages';
    '@href': string;
    '@representation': 'standard';
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
    number: string; // With 2 decimals
    state: TravisCiState;
    started_at: string; // ISO format, without ms
    finished_at: string; // ISO format, without ms
}

/**
 * Travis CI State Type
 */
export type TravisCiState = 'received' | 'queued' | 'created' | 'started' | 'passed' | 'failed' | 'errored' | 'canceled';
