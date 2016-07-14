import { PakProvider } from './pak-provider';
import { Pak } from './pak';

export class PakProviderLocalStorage implements PakProvider {
    public locked = false;
    public uniqueId = 'state-provider';
    public getPak = (pakId): Pak => {
        return new Pak();
    }
    public getPaks = (): Pak[] => {
        return [];
    }
}
