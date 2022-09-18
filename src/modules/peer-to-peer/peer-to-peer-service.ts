import { Peer } from 'peerjs';
import { get, writable } from 'svelte/store';

type Connection = any;
type ConnectionState =
    | { type: 'init' }
    | { type: 'ready'; peerId: string }
    | { type: 'connecting' }
    | { type: 'connected'; connection: Connection }
    | { type: 'disconnected' }
    | { type: 'error'; error: unknown };

export class PeerToPeerService {
    public connectionState = writable<ConnectionState>({ type: 'init' });

    protected readonly peer = new Peer();

    constructor(idParam: string | null, private onMessage: (data: unknown) => void) {
        this.peer.on('open', (peerId) => {
            console.log('Connection to the PeerServer is established.');

            if (idParam) {
                // if the client, connect to another peer by using `idParam`
                this.onConnection(this.peer.connect(idParam));
            } else {
                // if the host, move to `ready` state
                this.connectionState.set({ type: 'ready', peerId });
            }
        });

        this.peer.on('error', (error) => {
            console.error('Failed to connect to the PeerServer.', error);
            this.connectionState.set({ type: 'error', error });
        });

        // if the host, then we are waiting for the connection
        if (!idParam) {
            this.peer.on('connection', (connection) => {
                console.log('New data connection is established from a remote peer.');
                this.onConnection(connection);
            });
        }
    }

    public send(message: unknown) {
        const connectionState = get(this.connectionState);

        if (connectionState.type === 'connected') {
            console.log('%c⬇️ Send data to the remote peer.', 'color: red', message);
            connectionState.connection.send(message);
        }
    }

    private onConnection(connection: Connection) {
        const connectionState = get(this.connectionState);

        // allow only 1 connection
        if (connectionState.type !== 'connected') {
            this.connectionState.set({ type: 'connecting' });

            connection.on('open', () => {
                console.log('The connection is established and ready-to-use.');
                this.connectionState.set({ type: 'connected', connection });
            });
            connection.on('close', () => {
                console.log('Either you or the remote peer closes the data connection.');
                this.connectionState.set({ type: 'disconnected' });
            });
            connection.on('data', (data: unknown) => {
                console.log('%c⬆️ Data is received from the remote peer.', 'color: green', data);
                this.onMessage(data);
            });
            connection.on('error', (error: unknown) => {
                console.log('Failed to connect to the remote peer.', error);
                this.connectionState.set({ type: 'error', error });
            });
        }
    }
}
