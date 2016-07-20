import { ActivePak } from './active-pak';

export class ViewInstance {
    public static fromJSON(json: ViewInstanceJSON): ViewInstance {
        let viewInstance = new ViewInstance();
        viewInstance.viewState = json.viewState;
        return viewInstance;
    }

    public viewState: string;
    public activePak: ActivePak;
}

export interface ViewInstanceJSON {
    viewState: string;
}
