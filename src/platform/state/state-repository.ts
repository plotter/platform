import { PakDirectory } from '../pak/pak-directory';
import { StateSession } from './state-session';
import { StateDirectory } from './state-directory';

export interface StateRepository {
    locked: boolean;
    uniqueId: string;
    stateRepositoryType: StateRepositoryType;
    stateDirectory: StateDirectory;
    getPakDirectory(): Promise<PakDirectory>;
    getStateSession(sessionId: string): Promise<StateSession>;
    getSessionList(): Promise<string[]>;
    toJSON(): StateRepositoryJSON;
}

export interface StateRepositoryJSON {
    locked: boolean;
    uniqueId: string;
    stateRepositoryType: StateRepositoryType;
    path: string;
}

export type StateRepositoryType = 'LocalStorage' | 'Service' | 'GitHubGist' | 'File';
