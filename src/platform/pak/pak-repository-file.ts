import { HttpClient } from 'aurelia-fetch-client';
import { PakRepository, PakRepositoryType } from './pak-repository';
import { Pak } from './pak';
import { PakDirectory } from './pak-directory';

export class PakRepositoryFile implements PakRepository {
    public locked = false;
    public uniqueId = 'state-provider';
    public pakRepositoryType: PakRepositoryType = 'File';
    public pakDirectory: PakDirectory;
    public path: string;
    public pakList: string[];

    private pakMap = new Map<string, Pak>();
    private pakPromiseMap = new Map<string, Promise<Pak>>();

    constructor(private httpClient: HttpClient) {}

    public getPak = (pakId): Promise<Pak> => {

        if (this.pakPromiseMap.has(pakId)) {
            return this.pakPromiseMap.get(pakId);
        }

        let that = this;
        let pakPromise = new Promise<Pak>((resolve, reject) => {
            that.httpClient.fetch(`${that.path}/${that.uniqueId}/${pakId}.json`)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    let pak = Pak.fromJSON(data);
                    pak.pakRepository = that;
                    that.pakMap.set(pakId, pak);
                    resolve(pak);
                })
                .catch(reason => {
                    reject(new Error(`fetch session list: reason: \r\n\r\n${reason}`));
                });
        });

        this.pakPromiseMap.set(pakId, pakPromise);
        return pakPromise;
    }
    public getPakList = (): Promise<string[]> => {
        let that = this;

        return new Promise<string[]>((resolve, reject) => {
            that.httpClient.fetch(`${that.path}/${that.uniqueId}/pak-list.json`)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    that.pakList = data.pakList;
                    resolve(<string[]> data.pakList);
                })
                .catch(reason => {
                    reject(new Error(`fetch pak list failed: reason: \r\n\r\n${reason}`));
                });
        });
    }
}
