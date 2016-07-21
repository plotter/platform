import { ActivePak } from './active-pak';
import { View } from '../pak/view';

export class ViewInstance {
    public static fromJSON(json: ViewInstanceJSON): ViewInstance {
        let viewInstance = new ViewInstance();
        viewInstance.viewId = json.viewId;
        viewInstance.viewState = json.viewState;
        return viewInstance;
    }

    public viewId: string;
    public viewState: string;
    public activePak: ActivePak;

    private viewPromise: Promise<View>;

    public getView(): Promise<View> {

        if (this.viewPromise) {
            return this.viewPromise;
        }

        let that = this;
        return this.viewPromise = that.activePak.stateSession.stateRepository.getPakDirectory()
            .then(pakDirectory => {
                let pakHosts = pakDirectory.pakRepositories.filter(pr => pr.uniqueId === that.activePak.pakHostId);
                if (pakHosts.length >= 1) {
                    let pakHost = pakHosts[0];
                    return pakHost.getPak(that.activePak.pakId)
                        .then(pak => {
                            let view = pak.getView(that.viewId);
                            return view;
                        });
                } else {
                    throw(new Error(`Failed to get pak - couldn't find pakHost(${that.activePak.pakHostId})`));
                }
            });
    }
}

export interface ViewInstanceJSON {
    viewId: string;
    viewState: string;
}
