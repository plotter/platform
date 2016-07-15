import { StateRepository, StateRepositoryType } from './state-repository';
import { PakDirectory } from '../pak/pak-directory';
import { StateSession } from './state-session';

export class StateRepositoryFile implements StateRepository {
    public static fromJSON(json: StateRepositoryFileJSON): StateRepositoryFile {
        let stateRepository = new StateRepositoryFile();
        // assign properties...
        stateRepository.locked = json.locked;
        stateRepository.uniqueId = json.uniqueId;
        stateRepository.stateRepositoryType = json.stateRepositoryType;
        return stateRepository;
    }

    public locked = false;
    public uniqueId = 'state-repository';
    public stateRepositoryType: StateRepositoryType = 'File';
    public getPakDirectory = () => {
    return new PakDirectory();
}
    public getStateSession(sessionId) {
    return new StateSession();
}
    public toJSON(): StateRepositoryFileJSON {
    return {
        locked: this.locked,
        stateRepositoryType: this.stateRepositoryType,
        uniqueId: this.uniqueId,
    };
}
}

export interface StateRepositoryFileJSON {
    locked: boolean;
    uniqueId: string;
    stateRepositoryType: StateRepositoryType;
}
