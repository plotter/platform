import { Pak } from './pak';

export interface PakProvider {
    locked: boolean;
    uniqueId: string;
    getPak(pakId: string): Pak;
    getPaks(): Pak[];
}
