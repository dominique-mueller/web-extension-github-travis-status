// Content Script

console.log( 'CONTENT SCRIPT RUNNING' );

// document.body.appendChild( document.createComment( 'CONTENT SRIPT MANIPULATION' ) );

const connectionPort: chrome.runtime.Port = chrome.runtime.connect( {
    name: 'content_script'
} );
connectionPort.onMessage.addListener( ( message: any ) => {

    const statusDetailsLinks: Array<HTMLAnchorElement> = Array
        .from( document.querySelectorAll( 'a.status-actions[href^="https://travis-ci.org/"]' ) );

    const statusItems: Array<HTMLDivElement> = statusDetailsLinks
        .map( ( statusDetailsLink: HTMLAnchorElement ): HTMLDivElement => {
            return <HTMLDivElement> statusDetailsLink.closest( 'div.merge-status-item' );
        } );

    statusItems.forEach( ( statusItem: HTMLDivElement ) => {

        statusItem.classList.add( 'ext__status' );

        const mergeStatusItemDetails: HTMLDivElement = document.createElement( 'div' );
        mergeStatusItemDetails.classList.add( 'merge-status-item', 'ext__details' );

        const mergeStatusItemDetailsContent: HTMLDivElement = document.createElement( 'div' );
        mergeStatusItemDetailsContent.classList.add( 'ext__details-content' );
        mergeStatusItemDetails.appendChild( mergeStatusItemDetailsContent );

        const stagesList: HTMLUListElement = document.createElement( 'ul' );
        stagesList.classList.add( 'ext__stages' );
        message.stages.forEach( ( stage: any ) => {

            const stageElement: HTMLLIElement = document.createElement( 'li' );
            stageElement.classList.add( 'ext__stage' );

            const stageDetailsElement: HTMLDivElement = document.createElement( 'div' );
            stageElement.appendChild( stageDetailsElement );

            const stageNameElement: HTMLElement = document.createElement( 'strong' );
            stageNameElement.innerText = `[${ stage.state.toUpperCase() }] ${ stage.name }`;
            stageNameElement.classList.add( 'text-emphasized' );
            stageDetailsElement.appendChild( stageNameElement );

            const jobList: HTMLUListElement = document.createElement( 'ul' );
            jobList.classList.add( 'ext__jobs' );
            stage.jobs.forEach( ( job: any ) => {

                const jobElement: HTMLLIElement = document.createElement( 'li' );
                jobElement.classList.add( 'd-flex', 'ext__job' );

                const jobNameElement: HTMLSpanElement = document.createElement( 'span' );
                jobNameElement.innerText = `[${ job.state.toUpperCase() }] #${ job.number }`;
                jobElement.appendChild( jobNameElement );

                const jobTimeElement: HTMLSpanElement = document.createElement( 'span' );
                jobTimeElement.classList.add( 'label', 'Label--gray', 'ext__job-time' );

                // See: https://stackoverflow.com/questions/3733227/javascript-seconds-to-minutes-and-seconds
                const jobTime: number = ( ( new Date( job.finished_at ) ).getTime() - ( new Date( job.started_at ) ).getTime() ) / 1000;
                const jobTimeMinutes = Math.floor( jobTime / 60 );
                const jobTimeSeconds = jobTime - jobTimeMinutes * 60;

                jobTimeElement.innerText = `${ jobTimeMinutes } min ${ jobTimeSeconds } sec`;
                jobElement.appendChild( jobTimeElement );

                const jobDetailsLinkElement: HTMLAnchorElement = document.createElement( 'a' );
                jobDetailsLinkElement.href = '#';
                jobDetailsLinkElement.innerText = 'View log';
                jobElement.appendChild( jobDetailsLinkElement );

                jobList.appendChild( jobElement );

            } );

            stageElement.appendChild( jobList );
            stagesList.appendChild( stageElement );
        } );
        mergeStatusItemDetailsContent.appendChild( stagesList );

        statusItem.parentElement.insertBefore( mergeStatusItemDetails, statusItem.nextElementSibling );

        const buttonElement: HTMLButtonElement = document.createElement( 'button' );
        buttonElement.classList.add( 'label', 'Label--gray', 'ext__button' );
        buttonElement.innerText = 'Info';

        statusItem.insertBefore( buttonElement, statusItem.lastElementChild );

    } );

} );



// const travisCiBuildId = statusDetailsLinks[ 0 ]
//     .pathname // For example '/{ user-name }/{ repositry-name }/builds/{ build-id }', always with slash at the beginning
//     .split( '/' )[ 4 ];
