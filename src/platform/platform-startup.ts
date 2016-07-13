import { inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { StateDirectory } from './state/state-directory';
import { StateProvider } from './state/state-provider';
import { PlotterConfig } from './plotter-config';

@inject(HttpClient, PlotterConfig)
export class PlatformStartup {

    constructor(private httpClient: HttpClient, private plotterConfig: PlotterConfig) { }

    public start(): Promise<StateDirectory> {

        return new Promise<StateDirectory>((resolve, reject) => {

            let sdn = this.plotterConfig.stateDirectoryName;
            alert(`sdn: ${sdn}`);

            // for now,, hardwire a resolve with a state config
            let stateDirectory = new StateDirectory();
            stateDirectory.readOnly = false;
            stateDirectory.stateProviders = [
                new StateProvider()
            ]

            resolve(stateDirectory);

            // check if sdn has prefix (service:, githubgist:myStateDir[.json], localstorage:)
            if (sdn.toLowerCase().startsWith('service:')) { }
            else if (sdn.toLowerCase().startsWith('githubgist:')) { 
                reject('githubgist not supported yet.');
            }
            else if (sdn.toLowerCase().startsWith('localstorage:')) { }
            else {

                // check if (and use) platform origin has state-config

                // check if (and use) local storage has state-config

                // create state config in local storage
            }
        });
    }
}
