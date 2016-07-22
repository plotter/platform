import { ActivePak } from './active-pak';
import { View, PaneType } from '../pak/view';

export class ViewInstance {
    public static fromJSON(json: ViewInstanceJSON): ViewInstance {
        let viewInstance = new ViewInstance();
        viewInstance.uniqueId = json.uniqueId;
        viewInstance.viewId = json.viewId;
        viewInstance.viewModel = json.viewModel;
        viewInstance.viewState = json.viewState;
        viewInstance.paneType = json.paneType;
        return viewInstance;
    }

    public uniqueId: string;
    public viewId: string;
    public paneType: PaneType;
    public viewModel: string;
    public viewState: string;
    public activePak: ActivePak;
    public view: View;

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
                            that.view = view;
                            return view;
                        });
                } else {
                    throw(new Error(`Failed to get pak - couldn't find pakHost(${that.activePak.pakHostId})`));
                }
            });
    }
}

export interface ViewInstanceJSON {
    uniqueId: string;
    viewId: string;
    paneType: PaneType;
    viewModel: string;
    viewState: string;
}
