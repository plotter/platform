import { HttpClient } from 'aurelia-fetch-client';
import { PakRepository, PakRepositoryType } from './pak-repository';
import { Pak } from './pak';

export class PakRepositoryFile implements PakRepository {
    public locked = false;
    public uniqueId = 'state-provider';
    public pakRepositoryType: PakRepositoryType = 'File';
    public path: string;

    constructor(private httpClient: HttpClient) {}

    public getPak = (pakId): Promise<Pak> => {
        let that = this;
        return new Promise<Pak>((resolve, reject) => {
            that.httpClient.fetch(`${that.path}/${that.uniqueId}/${pakId}.json`)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    resolve(Pak.fromJSON(data));
                })
                .catch(reason => {
                    reject(new Error(`fetch session list: reason: \r\n\r\n${reason}`));
                });
        });
    }
    public getPakList = (): Promise<string[]> => {
        let that = this;

        return new Promise<string[]>((resolve, reject) => {
            that.httpClient.fetch(`${that.path}/${that.uniqueId}/pak-list.json`)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    resolve(<string[]> data.pakList);
                })
                .catch(reason => {
                    reject(new Error(`fetch pak list failed: reason: \r\n\r\n${reason}`));
                });
        });
    }
}
