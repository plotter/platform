import { HttpClient } from 'aurelia-fetch-client';
import { StateRepository, StateRepositoryJSON  } from './state-repository';
import { StateRepositoryFile } from './state-repository-file';
import { ElectronHelper } from '../electron-helper';
import { PhoneGapHelper } from '../phone-gap-helper';

export class StateDirectory {
    public static fromJSON(json: StateDirectoryJSON): StateDirectory {
        let stateDirectory = new StateDirectory();
        // assign properties...
        stateDirectory.locked = json.locked;
        stateDirectory.uniqueId = json.uniqueId;
        stateDirectory.stateRepositories = json.stateRepositories.map(stateRepositoryJSON => {
            switch (stateRepositoryJSON.stateRepositoryType) {
                case 'File':
                {
                    let stateRepository = new StateRepositoryFile(
                        new HttpClient(),
                        new ElectronHelper(),
                        new PhoneGapHelper());
                    stateRepository.locked = stateRepositoryJSON.locked;
                    stateRepository.uniqueId = stateRepositoryJSON.uniqueId;
                    stateRepository.stateRepositoryType = stateRepositoryJSON.stateRepositoryType;
                    stateRepository.path = stateRepositoryJSON.path;
                    stateRepository.stateDirectory = stateDirectory;
                    return stateRepository;
                }

                default:
                    throw new Error(`repository ${stateRepositoryJSON.stateRepositoryType} not supported.`);
            }
        });
        return stateDirectory;
    }

    public locked: boolean;
    public uniqueId: string;
    public stateRepositories: StateRepository[];

    public getStateRepository(uniqueId: string): StateRepository {

        // let the default plotter host (aka state repository) be the first one in the list
        if (!uniqueId && this.stateRepositories.length > 0) {
            return this.stateRepositories[0];
        }

        let repoMatch = null;
        this.stateRepositories.some(repo => {
            if (repo.uniqueId === uniqueId) {
                repoMatch = repo;
                return true; // stops processing, so we choose the first repo having that unique id
            }
            return false;
        });
        return repoMatch;
    }

    public getStateSession(stateRepositoryId: string, stateSessionId: string) {
        let repo = this.getStateRepository(stateRepositoryId);
        if (!repo) {
            throw new Error(`Could not retrieve repository: ${stateRepositoryId}`);
        }

        return repo.getStateSession(stateSessionId);
    }

    public toJSON(): StateDirectoryJSON {
        return {
            locked: this.locked,
            stateRepositories: this.stateRepositories.map(stateRepository => stateRepository.toJSON()),
            uniqueId: this.uniqueId,
        };
    }
}

export interface StateDirectoryJSON {
    locked: boolean;
    uniqueId: string;
    stateRepositories: StateRepositoryJSON[];
}
