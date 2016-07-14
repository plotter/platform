import { PakDirectory } from '../pak/pak-directory';
import { StateSession } from './state-session';

export interface StateProvider {
    locked: boolean;
    uniqueId: string;
    stateProviderType: StateProviderType;
    getPakDirectory(): PakDirectory;
    getStateSession(sessionId: string): StateSession;
    toJSON(): StateProviderJSON;
}

export interface StateProviderJSON {
    locked: boolean;
    uniqueId: string;
    stateProviderType: StateProviderType;
}

export type StateProviderType = 'LocalStorage' | 'Service' | 'GitHubGist';
