import { View, ViewJSON } from './view';
import { PakRepository } from './pak-repository';

export class Pak {
    public static fromJSON(json: PakJSON): Pak {
        let pak = new Pak();
        // assign properties...
        pak.locked = json.locked;
        pak.uniqueId = json.uniqueId;
        pak.views = json.views.map(viewJson => {
            let view = View.fromJSON(viewJson);
            view.pak = pak;
            return view;
        });
        return pak;
    }

    public locked: boolean;
    public uniqueId: string;
    public pakRepository: PakRepository;
    public views: View[];
}

export interface PakJSON {
    locked: boolean;
    uniqueId: string;
    views: ViewJSON[];
}
