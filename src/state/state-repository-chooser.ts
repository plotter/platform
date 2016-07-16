import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { StateDirectory } from '../platform/state/state-directory';
import { StateRepository } from '../platform/state/state-repository';

@inject(StateDirectory, Router)
export class StateRepositoryChooser {
    public states: StateRepository[];
    public state: StateRepository;

    constructor(private stateDirectory: StateDirectory, private router: Router) {
        this.states = stateDirectory.stateRepositories;
    }

    public choose = () => {
        // route to session chooser
        this.router.navigateToRoute('session', { uniqueId: this.state.uniqueId });
    }
}
