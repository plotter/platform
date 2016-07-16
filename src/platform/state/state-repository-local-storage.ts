import { StateRepository, StateRepositoryType, StateRepositoryJSON } from './state-repository';
import { PakDirectory } from '../pak/pak-directory';
import { StateSession } from './state-session';

export class StateRepositoryLocalStorage implements StateRepository {
    public static fromJSON(json: StateRepositoryJSON): StateRepositoryLocalStorage {
        let stateRepository = new StateRepositoryLocalStorage();
        // assign properties...
        stateRepository.locked = json.locked;
        stateRepository.uniqueId = json.uniqueId;
        stateRepository.stateRepositoryType = json.stateRepositoryType;
        return stateRepository;
    }

    public locked = false;
    public uniqueId = 'state-repository';
    public stateRepositoryType: StateRepositoryType = 'LocalStorage';
    public getPakDirectory = () => {
        return Promise.resolve<PakDirectory>(new PakDirectory());
    }
    public getStateSession(sessionId) {
        return Promise.resolve<StateSession>(new StateSession());
    }
    public getSessionList() {
        return new Promise<string[]>((resolve, reject) => {
            resolve(['A', 'B', 'C']);
        });
    }
    public toJSON(): StateRepositoryJSON {
    return {
        locked: this.locked,
        stateRepositoryType: this.stateRepositoryType,
        uniqueId: this.uniqueId,
        path: null,
    };
}
}

export interface StateRepositoryLocalStorageJSON {
    locked: boolean;
    uniqueId: string;
    stateRepositoryType: StateRepositoryType;
}
