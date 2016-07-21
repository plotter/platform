import { ViewInstance, ViewInstanceJSON } from './view-instance';
import { StateSession } from './state-session';
import { Pak } from '../pak/pak';

export class ActivePak {
    public static fromJSON(json: ActivePakJSON): ActivePak {
        let activePak = new ActivePak();
        activePak.locked = json.locked;
        activePak.uniqueId = json.uniqueId;
        activePak.pakHostId = json.pakHostId;
        activePak.pakId = json.pakId;
        activePak.viewInstances = json.viewInstances.map(viewInstanceJson => {
            let viewInstance = ViewInstance.fromJSON(viewInstanceJson);
            viewInstance.activePak = activePak;
            return viewInstance;
        });

        // let this run on the next 'tick' since it uses activePak's stateSession property 
        //    which isn't set until the return of this function
        setTimeout(() => activePak.getPak(), 0);

        return activePak;
    }

    public locked: boolean;
    public uniqueId: string;
    public pakHostId: string;
    public pakId: string;
    public pak: Pak;
    public viewInstances: ViewInstance[];
    public stateSession: StateSession;

    private pakPromise: Promise<Pak>;

    public getPak(): Promise<Pak> {

        if (this.pakPromise) {
            return this.pakPromise;
        }

        let that = this;
        return this.pakPromise = that.stateSession.stateRepository.getPakDirectory()
            .then(pakDirectory => {
                let pakHosts = pakDirectory.pakRepositories.filter(pr => pr.uniqueId === that.pakHostId);
                if (pakHosts.length >= 1) {
                    let pakHost = pakHosts[0];
                    return pakHost.getPak(that.pakId)
                        .then(pak => {
                            that.pak = pak;
                            return pak;
                        });
                } else {
                    throw(new Error(`Failed to get pak - couldn't find pakHost(${that.pakHostId})`));
                }
            });
    }
}

export interface ActivePakJSON {
    locked: boolean;
    uniqueId: string;
    pakHostId: string;
    pakId: string;
    viewInstances: ViewInstanceJSON[];
}
