import { StateProvider, StateProviderType } from './state-provider';
import { PakDirectory } from '../pak/pak-directory';
import { StateSession } from './state-session';

export class StateProviderLocalStorage implements StateProvider {
    public static fromJSON(json: StateProviderLocalStorageJSON): StateProviderLocalStorage {
        let stateProvider = new StateProviderLocalStorage();
        // assign properties...
        stateProvider.locked = json.locked;
        stateProvider.uniqueId = json.uniqueId;
        stateProvider.stateProviderType = json.stateProviderType;
        return stateProvider;
    }

    public locked = false;
    public uniqueId = 'state-provider';
    public stateProviderType: StateProviderType = 'LocalStorage';
    public getPakDirectory = () => {
    return new PakDirectory();
}
    public getStateSession(sessionId) {
    return new StateSession();
}
    public toJSON(): StateProviderLocalStorageJSON {
    return {
        locked: this.locked,
        stateProviderType: this.stateProviderType,
        uniqueId: this.uniqueId,
    };
}
}

export interface StateProviderLocalStorageJSON {
    locked: boolean;
    uniqueId: string;
    stateProviderType: StateProviderType;
}
