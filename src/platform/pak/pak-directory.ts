import { HttpClient } from 'aurelia-fetch-client';
import { PakRepository, PakRepositoryJSON } from './pak-repository';
import { PakRepositoryFile } from './pak-repository-file';
import { StateRepository } from '../state/state-repository';
import { ElectronHelper } from '../electron-helper';
import { PhoneGapHelper } from '../phone-gap-helper';

export class PakDirectory {
    public static fromJSON(json: PakDirectoryJSON): PakDirectory {
        let pakDirectory = new PakDirectory();
        // assign properties...
        pakDirectory.locked = json.locked;
        pakDirectory.uniqueId = json.uniqueId;
        pakDirectory.pakRepositories = json.pakRepositories.map(pakRepositoryJSON => {
            switch (pakRepositoryJSON.pakRepositoryType) {
                case 'File':
                    {
                        let pakRepository = new PakRepositoryFile(
                            new HttpClient(),
                            new ElectronHelper(),
                            new PhoneGapHelper());
                        pakRepository.locked = pakRepositoryJSON.locked;
                        pakRepository.uniqueId = pakRepositoryJSON.uniqueId;
                        pakRepository.pakRepositoryType = pakRepositoryJSON.pakRepositoryType;
                        pakRepository.path = pakRepositoryJSON.path;
                        pakRepository.pakDirectory = pakDirectory;
                        return pakRepository;
                    }

                default:
                    throw new Error(`repository ${pakRepositoryJSON.pakRepositoryType} not supported.`);
            }
        });
        return pakDirectory;
    }

    public locked: boolean;
    public uniqueId: string;
    public pakRepositories: PakRepository[];
    public stateRepository: StateRepository;

    public toJSON(): PakDirectoryJSON {
        return JSON.parse(JSON.stringify(this));
    }
}

// A representation of User's data that can be converted to
// and from JSON without being altered.
interface PakDirectoryJSON {
    locked: boolean;
    uniqueId: string;
    pakRepositories: PakRepositoryJSON[];
}
