import { HttpClient } from 'aurelia-fetch-client';
import { StateRepository, StateRepositoryJSON  } from './state-repository';
import { StateRepositoryLocalStorage } from './state-repository-local-storage';
import { StateRepositoryFile } from './state-repository-file';

export class StateDirectory {
    public static fromJSON(json: StateDirectoryJSON): StateDirectory {
        let stateDirectory = new StateDirectory();
        // assign properties...
        stateDirectory.locked = json.locked;
        stateDirectory.uniqueId = json.uniqueId;
        stateDirectory.stateRepositories = json.stateRepositories.map(stateRepositoryJSON => {
            switch (stateRepositoryJSON.stateRepositoryType) {
                case 'LocalStorage':
                {
                    let stateRepository = new StateRepositoryLocalStorage();
                    stateRepository.locked = stateRepositoryJSON.locked;
                    stateRepository.uniqueId = stateRepositoryJSON.uniqueId;
                    stateRepository.stateRepositoryType = stateRepositoryJSON.stateRepositoryType;
                    return <StateRepository> stateRepository;
                }

                case 'File':
                {
                    let stateRepository = new StateRepositoryFile(new HttpClient());
                    stateRepository.locked = stateRepositoryJSON.locked;
                    stateRepository.uniqueId = stateRepositoryJSON.uniqueId;
                    stateRepository.stateRepositoryType = stateRepositoryJSON.stateRepositoryType;
                    stateRepository.path = stateRepositoryJSON.path;
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

    public getStateRepository(uniqueId: string) {
        let repoMatch = null;
        this.stateRepositories.forEach(repo => {
            if (repo.uniqueId === uniqueId) {
                repoMatch = repo;
            }
        });
        return repoMatch;
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
