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
            stageElement.innerText = `[${ stage.state }] ${ stage.name }`;

            const jobList: HTMLUListElement = document.createElement( 'ul' );
            jobList.classList.add( 'ext__jobs' );
            stage.jobs.forEach( ( job: any ) => {
                const jobElement: HTMLLIElement = document.createElement( 'li' );
                jobElement.classList.add( 'ext__job' );
                jobElement.innerText = `[${ job.state }] ${ job.number }`;
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
