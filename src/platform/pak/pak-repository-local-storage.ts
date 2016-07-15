import { PakRepository } from './pak-repository';
import { Pak } from './pak';

export class PakRepositoryLocalStorage implements PakRepository {
    public locked = false;
    public uniqueId = 'state-provider';
    public getPak = (pakId): Pak => {
        return new Pak();
    }
    public getPaks = (): Pak[] => {
        return [];
    }
}
