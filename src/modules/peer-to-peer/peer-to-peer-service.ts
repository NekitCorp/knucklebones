import { Peer } from 'peerjs';
import { get, writable } from 'svelte/store';

type Connection = any;
export type ConnectionSide = 'host' | 'client';
type ConnectionState =
    | { type: 'init' }
    | { type: 'ready' }
    | { type: 'connecting' }
    | { type: 'connected'; connection: Connection; side: ConnectionSide }
    | { type: 'disconnected' }
    | { type: 'error'; error: unknown };

export class PeerToPeerService {
    public id = writable<string>('');
    public connectionState = writable<ConnectionState>({ type: 'init' });

    protected readonly peer = new Peer();

    constructor(private onMessage: (data: unknown) => void) {
        this.peer.on('open', (id) => {
            console.log('Connection to the PeerServer is established.');
            this.id.set(id);
            this.connectionState.set({ type: 'ready' });
        });
        this.peer.on('error', (error) => {
            console.error('Failed to connect to the PeerServer.', error);
            this.connectionState.set({ type: 'error', error });
        });
        this.peer.on('connection', (connection) => {
            console.log('New data connection is established from a remote peer.');
            this.onConnection(connection, 'host');
        });
    }

    public connect(id: string) {
        this.onConnection(this.peer.connect(id), 'client');
    }

    public send(message: unknown) {
        const connectionState = get(this.connectionState);

        if (connectionState.type === 'connected') {
            connectionState.connection.send(message);
        }
    }

    private onConnection(connection: Connection, side: ConnectionSide) {
        const connectionState = get(this.connectionState);

        // allow only 1 connection
        if (connectionState.type !== 'connected') {
            this.connectionState.set({ type: 'connecting' });

            connection.on('open', () => {
                console.log('The connection is established and ready-to-use.');
                this.connectionState.set({
                    type: 'connected',
                    connection,
                    side,
                });
            });
            connection.on('close', () => {
                console.log('Either you or the remote peer closes the data connection.');
                this.connectionState.set({ type: 'disconnected' });
            });
            connection.on('data', (data: unknown) => {
                console.log('Data is received from the remote peer.', data);
                this.onMessage(data);
            });
            connection.on('error', (error: unknown) => {
                console.log('Failed to connect to the remote peer.', error);
                this.connectionState.set({ type: 'error', error });
            });
        }
    }
}
