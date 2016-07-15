import { PakDirectory } from '../pak/pak-directory';
import { StateSession } from './state-session';

export interface StateRepository {
    locked: boolean;
    uniqueId: string;
    stateRepositoryType: StateRepositoryType;
    getPakDirectory(): PakDirectory;
    getStateSession(sessionId: string): StateSession;
    toJSON(): StateRepositoryJSON;
}

export interface StateRepositoryJSON {
    locked: boolean;
    uniqueId: string;
    stateRepositoryType: StateRepositoryType;
}

export type StateRepositoryType = 'LocalStorage' | 'Service' | 'GitHubGist' | 'File';
