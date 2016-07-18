export class ViewInstance {
    public static fromJSON(json: ViewInstanceJSON): ViewInstance {
        let viewInstance = new ViewInstance();
        viewInstance.viewState = json.viewState;
        return viewInstance;
    }

    public viewState: string;
}

export interface ViewInstanceJSON {
    viewState: string;
}
