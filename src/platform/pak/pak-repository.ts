import { Pak } from './pak';
import { PakDirectory } from './pak-directory';

export interface PakRepository {
    locked: boolean;
    uniqueId: string;
    pakDirectory: PakDirectory;
    pakList: string[];
    getPak(pakId: string): Promise<Pak>;
    getPakList(): Promise<string[]>;
}

export interface PakRepositoryJSON {
    locked: boolean;
    uniqueId: string;
    pakRepositoryType: PakRepositoryType;
    path: string;
}

export type PakRepositoryType = 'LocalStorage' | 'Service' | 'GitHubGist' | 'File';
