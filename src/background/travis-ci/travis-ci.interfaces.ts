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
    state: string;
    started_at: string; // ISO format
    finished_at: string; // ISO format
    jobs: Array<TravisCiJob>;
}

export interface TravisCiJob {
    '@type': 'job';
    '@href': string;
    '@representation': 'minimal';
    id: number;
    number: string; // With 2 decimals
    state: string;
    started_at: string; // ISO format
    finished_at: string; // ISO format
}
