import { ActivePak, ActivePakJSON } from './active-pak';

export class StateSession {

    public static fromJSON(json: StateSessionJSON): StateSession {
        let stateSession = new StateSession();
        // assign properties...
        stateSession.locked = json.locked;
        stateSession.uniqueId = json.uniqueId;
        stateSession.activePaks = json.activePaks.map(activePak => {
            return ActivePak.fromJSON(activePak);
        });
        return stateSession;
    }

    public locked: boolean;
    public uniqueId: string;
    public activePaks: ActivePak[] = [];
}

export interface StateSessionJSON {
    locked: boolean;
    uniqueId: string;
    activePaks: ActivePakJSON[];
}
