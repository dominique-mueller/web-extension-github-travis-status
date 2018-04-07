import { TravisCiClient } from './travis-ci/travis-ci.client';
import { TravisCiStages } from './travis-ci/travis-ci.interfaces';

// Background

console.log( 'RUNNING BACKGROUND!' );

const travisCiClient: TravisCiClient = new TravisCiClient();
travisCiClient
    .fetchBuildStagesWithJobs( 360312950 )
    .then( ( result: TravisCiStages ) => {
        console.log( result );
    } );
