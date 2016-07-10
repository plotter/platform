import { inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { StateDirectory } from './state/state-directory';
import { PlotterConfig } from './plotter-config';

@inject(HttpClient, PlotterConfig)
export class PlatformStartup {

    constructor(private httpClient: HttpClient, private plotterConfig: PlotterConfig) {}

    public start(): Promise<StateDirectory> {

        return new Promise<StateDirectory>((resolve, reject) => {

            let sdn = this.plotterConfig.stateDirectoryName;
            alert(`sdn: ${sdn}`);

            // for now,, hardwire a resolve with a state config
            let stateDirectory: StateDirectory = {
                hosts: [
                    { stateProviderType: 'localStorage' },
                ],
                readOnly: false,
            };

            resolve(stateDirectory);

            // check if (and use) platform origin has state-config

            // check if (and use) local storage has state-config

            // create state config in local storage

        });
    }
}
