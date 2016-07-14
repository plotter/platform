import { StateProvider, StateProviderJSON  } from './state-provider';
import { StateProviderLocalStorage } from './state-provider-local-storage';

export class StateDirectory {
    public static fromJSON(json: StateDirectoryJSON): StateDirectory {
        let stateDirectory = new StateDirectory();
        // assign properties...
        stateDirectory.locked = json.locked;
        stateDirectory.uniqueId = json.uniqueId;
        stateDirectory.stateProviders = json.stateProviders.map(stateProviderJSON => {
            switch (stateProviderJSON.stateProviderType) {
                case 'LocalStorage':
                    let stateProvider = new StateProviderLocalStorage();
                    stateProvider.locked = stateProviderJSON.locked;
                    stateProvider.uniqueId = stateProviderJSON.uniqueId;
                    stateProvider.stateProviderType = stateProviderJSON.stateProviderType;
                    return stateProvider;

                default:
                    throw new Error(`provider ${stateProviderJSON.stateProviderType} not supported.`);
            }
        });
        return stateDirectory;
    }

    public locked: boolean;
    public uniqueId: string;
    public stateProviders: StateProvider[];

    public toJSON(): StateDirectoryJSON {
        return {
            locked: this.locked,
            stateProviders: this.stateProviders.map(stateProvider => stateProvider.toJSON()),
            uniqueId: this.uniqueId,
        };
    }
}

export interface StateDirectoryJSON {
    locked: boolean;
    uniqueId: string;
    stateProviders: StateProviderJSON[];
}
