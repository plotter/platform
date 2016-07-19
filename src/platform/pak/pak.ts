import { View, ViewJSON } from './view';

export class Pak {
    public static fromJSON(json: PakJSON): Pak {
        let pak = new Pak();
        // assign properties...
        pak.locked = json.locked;
        pak.uniqueId = json.uniqueId;
        pak.views = json.views.map(view => {
            return View.fromJSON(view);
        });
        return pak;
    }

    public locked: boolean;
    public uniqueId: string;
    public views: View[];
}

export interface PakJSON {
    locked: boolean;
    uniqueId: string;
    views: ViewJSON[];
}
