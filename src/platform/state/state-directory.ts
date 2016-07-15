import { StateRepository, StateRepositoryJSON  } from './state-repository';
import { StateRepositoryLocalStorage } from './state-repository-local-storage';

export class StateDirectory {
    public static fromJSON(json: StateDirectoryJSON): StateDirectory {
        let stateDirectory = new StateDirectory();
        // assign properties...
        stateDirectory.locked = json.locked;
        stateDirectory.uniqueId = json.uniqueId;
        stateDirectory.stateRepositories = json.stateRepositories.map(stateRepositoryJSON => {
            switch (stateRepositoryJSON.stateRepositoryType) {
                case 'LocalStorage':
                    let stateRepository = new StateRepositoryLocalStorage();
                    stateRepository.locked = stateRepositoryJSON.locked;
                    stateRepository.uniqueId = stateRepositoryJSON.uniqueId;
                    stateRepository.stateRepositoryType = stateRepositoryJSON.stateRepositoryType;
                    return stateRepository;

                default:
                    throw new Error(`repository ${stateRepositoryJSON.stateRepositoryType} not supported.`);
            }
        });
        return stateDirectory;
    }

    public locked: boolean;
    public uniqueId: string;
    public stateRepositories: StateRepository[];

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
