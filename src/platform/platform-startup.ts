import { inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { StateDirectory } from './state/state-directory';
import { Plotter } from './plotter';
import { ElectronHelper } from './electron-helper';
import { PhoneGapHelper } from './phone-gap-helper';

@inject(HttpClient, Plotter, ElectronHelper, PhoneGapHelper)
export class PlatformStartup {

    constructor(
        private httpClient: HttpClient,
        private plotter: Plotter,
        private electronHelper: ElectronHelper,
        private phoneGapHelper: PhoneGapHelper) { }

    public start(): Promise<StateDirectory> {
        let that = this;

        return new Promise<StateDirectory>((resolve, reject) => {

            let sdn = that.plotter.stateDirectoryName;

            // check if sdn has prefix (service:, githubgist:myStateDir[.json], localstorage:)
            if (sdn.toLowerCase().startsWith('service:')) {
                reject('service not supported yet.');
            } else
                if (sdn.toLowerCase().startsWith('githubgist:')) {
                    reject('githubgist not supported yet.');
                } else
                    if (sdn.toLowerCase().startsWith('localstorage:')) {
                        reject('localstorage not supported yet.');
                    } else {

                        // check if (and use) platform origin has state-directory
                        // this.httpClient.baseUrl = 'http://localhost:9000/';

                        if (that.electronHelper.isElectron) {
                            let fs = that.electronHelper.fs;
                            let resourcePath = that.electronHelper.userDataPath;

                            fs.readFile(`${resourcePath}/${sdn}.json`, (err, stringData) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }

                                let data = JSON.parse(stringData);

                                let stateDirectory = StateDirectory.fromJSON(data);
                                that.plotter.stateDirectory = stateDirectory;
                                resolve(stateDirectory);
                                return;
                            });
                        } else if (that.phoneGapHelper.isPhoneGap) {
                            that.phoneGapHelper.readFromFile(`${sdn}.json`)
                                .then((o: any) => {
                                    let stateDirectory = StateDirectory.fromJSON(o);
                                    that.plotter.stateDirectory = stateDirectory;
                                    resolve(stateDirectory);
                                })
                                .catch(r => reject(r));
                        } else {
                            that.httpClient.fetch(`${sdn}.json`)
                                .then(response => {
                                    return response.json();
                                })
                                .then(data => {
                                    let stateDirectory = StateDirectory.fromJSON(data);
                                    that.plotter.stateDirectory = stateDirectory;
                                    resolve(stateDirectory);
                                })
                                .catch(reason => {
                                    reject(new Error(`fetch state-dictionary2: reason: \r\n\r\n${reason}`));
                                });

                            // check if (and use) local storage has state-directory

                            // create state-directory in local storage
                        }
                    }
        });
    }
}
