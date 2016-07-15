import { Pak } from './pak';

export interface PakRepository {
    locked: boolean;
    uniqueId: string;
    getPak(pakId: string): Pak;
    getPaks(): Pak[];
}
