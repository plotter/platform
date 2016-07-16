import { inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { StateRepository, StateRepositoryType, StateRepositoryJSON } from './state-repository';
import { PakDirectory } from '../pak/pak-directory';
import { StateSession } from './state-session';

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
    public path: string;

    constructor(private httpClient: HttpClient) {}

    public getPakDirectory = () => {
        return Promise.resolve<PakDirectory>(new PakDirectory());
    }
    public getStateSession(sessionId) {
        return Promise.resolve<StateSession>(new StateSession());
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
