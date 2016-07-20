import { ViewInstance, ViewInstanceJSON } from './view-instance';
import { StateSession } from './state-session';

export class ActivePak {
    public static fromJSON(json: ActivePakJSON): ActivePak {
        let activePak = new ActivePak();
        activePak.locked = json.locked;
        activePak.uniqueId = json.uniqueId;
        activePak.viewInstances = json.viewInstances.map(viewInstanceJson => {
            let viewInstance = ViewInstance.fromJSON(viewInstanceJson);
            viewInstance.activePak = activePak;
            return viewInstance;
        });

        return activePak;
    }

    public locked: boolean;
    public uniqueId: string;
    public viewInstances: ViewInstance[];
    public stateSession: StateSession;
}

export interface ActivePakJSON {
    locked: boolean;
    uniqueId: string;
    viewInstances: ViewInstanceJSON[];
}
