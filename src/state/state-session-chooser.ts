import { inject } from 'aurelia-framework';
import { StateDirectory } from '../platform/state/state-directory';
import { StateRepository } from '../platform/state/state-repository';

@inject(StateDirectory)
export class StateSessionChooser {
    public stateRepoUniqueId: string;
    public stateRepo: StateRepository;
    public message: string = 'no message.';
    public sessionList: string[] = [];

    constructor(private stateDirectory: StateDirectory) {}

    public activate(params) {
        let that = this;

        this.stateRepoUniqueId = params.uniqueId;
        this.stateRepo = this.stateDirectory.getStateRepository(this.stateRepoUniqueId);
        if (this.stateRepo) {
            this.message = 'found repo';
            this.stateRepo.getSessionList()
                .then(sessionList => {
                    that.sessionList = sessionList;
                });
        } else {
            this.message = 'did not find repo';
        }
    }

    public choose() {
        
    }
}
