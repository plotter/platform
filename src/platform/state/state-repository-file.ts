import { inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { StateRepository, StateRepositoryType, StateRepositoryJSON } from './state-repository';
import { PakDirectory } from '../pak/pak-directory';
import { StateSession } from './state-session';
import { StateDirectory } from './state-directory';

@inject(HttpClient)
export class StateRepositoryFile implements StateRepository {
    public static fromJSON(json: StateRepositoryJSON): StateRepositoryFile {
        let stateRepository = new StateRepositoryFile(new HttpClient());
        // assign properties...
        stateRepository.locked = json.locked;
        stateRepository.uniqueId = json.uniqueId;
        stateRepository.stateRepositoryType = json.stateRepositoryType;
        stateRepository.path = json.path;
        return stateRepository;
    }

    public locked = false;
    public uniqueId = 'state-repository';
    public stateRepositoryType: StateRepositoryType = 'File';
    public stateDirectory: StateDirectory;
    public path: string;

    private pakDirectoryPromise: Promise<PakDirectory>;
    private stateSessionPromiseMap = new Map<string, Promise<StateSession>>();
    private stateSessionMap = new Map<string, StateSession>();

    constructor(private httpClient: HttpClient) {}

    public getPakDirectory = () => {

        if (this.pakDirectoryPromise) {
            return this.pakDirectoryPromise;
        }

        let that = this;
        return this.pakDirectoryPromise = new Promise<PakDirectory>((resolve, reject) => {
            that.httpClient.fetch(`${that.path}/${that.uniqueId}/pak-directory.json`)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    let pakDirectory = PakDirectory.fromJSON(data);
                    pakDirectory.stateRepository = that;
                    resolve(pakDirectory);
                })
                .catch(reason => {
                    reject(new Error(`fetch pak-directory failed: reason: \r\n\r\n${reason}`));
                });
        });
    }

    public getStateSession(sessionId: string): Promise<StateSession> {

        if (this.stateSessionPromiseMap.has(sessionId)) {
            return this.stateSessionPromiseMap.get(sessionId);
        }

        let that = this;
        let stateSessionPromise = new Promise<StateSession>((resolve, reject) => {
            that.httpClient.fetch(`${that.path}/${that.uniqueId}/${sessionId}.json`)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    let stateSession = StateSession.fromJSON(data);
                    stateSession.stateRepository = that;
                    that.stateSessionMap.set(sessionId, stateSession);
                    resolve(stateSession);
                })
                .catch(reason => {
                    reject(new Error(`fetch session list: reason: \r\n\r\n${reason}`));
                });
        });

        this.stateSessionPromiseMap.set(sessionId, stateSessionPromise);
        return stateSessionPromise;
    }
    public getSessionList() {
        let that = this;

        return new Promise<string[]>((resolve, reject) => {
            that.httpClient.fetch(`${that.path}/${that.uniqueId}/session-list.json`)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    resolve(<string[]> data.sessionList);
                })
                .catch(reason => {
                    reject(new Error(`fetch session list: reason: \r\n\r\n${reason}`));
                });
        });
    }
    public toJSON(): StateRepositoryJSON {
        return {
            locked: this.locked,
            stateRepositoryType: this.stateRepositoryType,
            uniqueId: this.uniqueId,
            path: this.path,
        };
    }
}

export interface StateRepositoryFileJSON {
    locked: boolean;
    uniqueId: string;
    stateRepositoryType: StateRepositoryType;
}

// 
