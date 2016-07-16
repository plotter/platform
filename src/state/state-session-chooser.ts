import { inject } from 'aurelia-framework';
import { StateDirectory } from '../platform/state/state-directory';
import { StateRepository } from '../platform/state/state-repository';

@inject(StateDirectory)
export class StateSessionChooser {
    stateRepoUniqueId: string;
    stateRepo: StateRepository;
    message: string = 'no message.';

    activate(params) {
        this.stateRepoUniqueId = params.uniqueId;
        this.stateRepo = this.stateDirectory.getStateRepository(this.stateRepoUniqueId);
        if (this.stateRepo) {
            this.message = 'found repo';
        } else {
            this.message = 'did not find repo';
        }
    }

    constructor(private stateDirectory: StateDirectory) {}
}
