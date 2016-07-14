import { inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { StateDirectory } from './state/state-directory';
import { StateProvider } from './state/state-provider';
import { StateProviderLocalStorage } from './state/state-provider-local-storage';
import { PlotterConfig } from './plotter-config';

@inject(HttpClient, PlotterConfig)
export class PlatformStartup {

    constructor(private httpClient: HttpClient, private plotterConfig: PlotterConfig) { }

    public start(): Promise<StateDirectory> {

        return new Promise<StateDirectory>((resolve, reject) => {

            let sdn = this.plotterConfig.stateDirectoryName;
            alert(`sdn: ${sdn}`);

            // for now,, hardwire a resolve with a state config
            // let stateDirectory = new StateDirectory();
            // stateDirectory.locked = false;
            // stateDirectory.stateProviders = [
            //     new StateProviderLocalStorage(),
            // ];

            // resolve(stateDirectory);

            // check if sdn has prefix (service:, githubgist:myStateDir[.json], localstorage:)
            if (sdn.toLowerCase().startsWith('service:')) {

            } else
                if (sdn.toLowerCase().startsWith('githubgist:')) {
                    reject('githubgist not supported yet.');
                } else
                    if (sdn.toLowerCase().startsWith('localstorage:')) {

                    } else {

                        // check if (and use) platform origin has state-directory
                        this.httpClient.fetch(`${sdn}.json`)
                            .then(response => response.json())
                            .then(data => {
                                let stateDirectory = StateDirectory.fromJSON(data);
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
