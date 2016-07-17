import { inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { StateDirectory } from './state/state-directory';
import { StateRepository } from './state/state-repository';
import { StateRepositoryLocalStorage } from './state/state-repository-local-storage';
import { Plotter } from './plotter';

@inject(HttpClient, Plotter)
export class PlatformStartup {

    constructor(private httpClient: HttpClient, private plotter: Plotter) { }

    public start(): Promise<StateDirectory> {
        let that = this;

        return new Promise<StateDirectory>((resolve, reject) => {

            let sdn = this.plotter.stateDirectoryName;

            // check if sdn has prefix (service:, githubgist:myStateDir[.json], localstorage:)
            if (sdn.toLowerCase().startsWith('service:')) {

            } else
                if (sdn.toLowerCase().startsWith('githubgist:')) {
                    reject('githubgist not supported yet.');
                } else
                    if (sdn.toLowerCase().startsWith('localstorage:')) {

                    } else {

                        // check if (and use) platform origin has state-directory
                        // this.httpClient.baseUrl = 'http://localhost:9000/';
                        that.httpClient.fetch(`${sdn}.json`)
                            .then(response => {
                                return response.json();
                            })
                            .then(data => {
                                let stateDirectory = StateDirectory.fromJSON(data);
                                this.plotter.stateDirectory = stateDirectory;
                                resolve(stateDirectory);
                            })
                            .catch(reason => {
                                reject(new Error(`fetch state-dictionary2: reason: \r\n\r\n${reason}`));
                            });

                        // check if (and use) local storage has state-directory

                        // create state-directory in local storage
                    }
        });
    }
}
