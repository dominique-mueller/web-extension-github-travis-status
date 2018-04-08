// Content Script

console.log( 'CONTENT SCRIPT RUNNING' );

// document.body.appendChild( document.createComment( 'CONTENT SRIPT MANIPULATION' ) );

const connectionPort: chrome.runtime.Port = chrome.runtime.connect( {
    name: 'content_script'
} );
connectionPort.onMessage.addListener( ( message: any ) => {
    console.log( message );
} );

const statusDetailsLinks: Array<HTMLAnchorElement> = Array
    .from( document.querySelectorAll( 'a.status-actions[href^="https://travis-ci.org/"]' ) );

const statusItems: Array<HTMLDivElement> = statusDetailsLinks
    .map( ( statusDetailsLink: HTMLAnchorElement ): HTMLDivElement => {
        return <HTMLDivElement> statusDetailsLink.closest( 'div.merge-status-item' );
    } );

statusItems.forEach( ( statusItem: HTMLDivElement ) => {
    const buttonElement: HTMLButtonElement = document.createElement( 'button' );
    buttonElement.classList.add( 'ext__button' );
    buttonElement.innerText = 'More';
    statusItem.appendChild( buttonElement );
} );

// const travisCiBuildId = statusDetailsLinks[ 0 ]
//     .pathname // For example '/{ user-name }/{ repositry-name }/builds/{ build-id }', always with slash at the beginning
//     .split( '/' )[ 4 ];
