import { TravisCiBuild, TravisCiStage, TravisCiJob } from './travis-ci.interfaces';

/**
 * Travis CI client
 */
export class TravisCiClient {

    /**
     * Travis CI base url
     */
    private readonly baseUrl: string;

    /**
     * Travis CI api version
     */
    private readonly apiVersion: number;

    /**
     * Constructor
     */
    constructor() {
        this.baseUrl = 'https://api.travis-ci.org';
        this.apiVersion = 3;
    }

    /**
     * Fetch build details
     *
     * Documentation:
     * - Fetching build details: https://developer.travis-ci.org/resource/build
     * - Eager loading (here used to load more job info): https://developer.travis-ci.org/eager-loading
     *
     * @param buildId - Build ID
     * @returns       - Promise, resolving with Travis CI build details
     */
    public fetchBuildDetails( buildId: number ): Promise<TravisCiBuild> {
        return fetch( `${ this.baseUrl }/build/${ buildId }?include=job.stage,job.state,job.number,job.started_at,job.finished_at`, {
            method: 'GET',
            headers: new Headers( {
                'Travis-API-Version': this.apiVersion.toString()
            } )
        } )
            .then( ( response: Response ): Promise<TravisCiBuild> => {
                return response.json();
            } )
            .then( ( travisCiBuild: TravisCiBuild ): Promise<TravisCiBuild> => {
                travisCiBuild.stages.sort( ( a: TravisCiStage, b: TravisCiStage ): number => {
                    return a.number - b.number;
                } );
                travisCiBuild.jobs.sort( ( a: TravisCiJob, b: TravisCiJob ): number => {
                    return parseFloat( a.number ) - parseFloat( b.number );
                } );
                return Promise.resolve( travisCiBuild );
            } );
    }

}
