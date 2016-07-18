import { ViewInstance, ViewInstanceJSON } from './view-instance';

export class ActivePak {
    public static fromJSON(json: ActivePakJSON): ActivePak {
        let activePak = new ActivePak();
        activePak.locked = json.locked;
        activePak.uniqueId = json.uniqueId;
        activePak.viewInstances = json.viewInstances.map(viewInstance => {
            return ViewInstance.fromJSON(viewInstance);
        });

        return activePak;
    }

    public locked: boolean;
    public uniqueId: string;
    public viewInstances: ViewInstance[];
}

export interface ActivePakJSON {
    locked: boolean;
    uniqueId: string;
    viewInstances: ViewInstanceJSON[];
}
