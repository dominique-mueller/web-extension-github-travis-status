import { TravisCiStages } from './travis-ci.interfaces';

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

    public fetchStages( buildId: number ): Promise<TravisCiStages> {
        return fetch( `${ this.baseUrl }/build/${ buildId }/stages?include=job.state,job.number,job.started_at,job.finished_at`, {
            method: 'GET',
            headers: new Headers( {
                'Travis-API-Version': this.apiVersion.toString()
            } )
        } )
            .then( ( response: Response ): Promise<TravisCiStages> => {
                return response.json();
            } );
    }

}
