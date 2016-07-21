import { inject } from 'aurelia-framework';
import { StateDirectory } from '../platform/state/state-directory';
import { StateRepository } from '../platform/state/state-repository';
import { PakDirectory } from '../platform/pak/pak-directory';

@inject(StateDirectory)
export class NewSession {
    public hostId: string;
    public stateRepository: StateRepository;
    public pakDirectory: PakDirectory;

    constructor(private stateDirectory: StateDirectory) {}

    public activate(params) {
        let that = this;
        this.hostId = params.hostId;
        this.stateRepository = this.stateDirectory.getStateRepository(this.hostId);
        this.stateRepository.getPakDirectory()
            .then(pakDirectory => {
                that.pakDirectory = pakDirectory;
                that.pakDirectory.pakRepositories.forEach(pakRepo => {
                    pakRepo.getPakList();
                });
            });
    }
}
