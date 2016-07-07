import { StateConfig } from './state-config/state-config';
import { StateProviderType } from './state-config/state-provider';

export function platformStartup(): Promise<StateConfig> {

    return new Promise<StateConfig>((resolve, reject) => {

        // for now, hardwire a resolve with a state config
        let stateConfig: StateConfig = {
            providers: [
                { type: StateProviderType.localStorage },
            ],
            readOnly: false,
        };

        resolve(stateConfig);

        // check if (and use) platform origin has state-config

        // check if (and use) local storage has state-config

        // create state config in local storage

    });
}
