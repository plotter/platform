import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { StateDirectory } from '../platform/state/state-directory';
import { StateRepository } from '../platform/state/state-repository';
import { Plotter } from '../platform/plotter';

@inject(StateDirectory, Router, Plotter)
export class StateRepositoryChooser {
    public states: StateRepository[];
    public state: StateRepository;

    constructor(private stateDirectory: StateDirectory, private router: Router, private plotter: Plotter) {
        this.states = stateDirectory.stateRepositories;
    }

    public choose = () => {
        // route to session chooser
        this.plotter.stateRepository = this.state;
        this.router.navigateToRoute('session', { hostId: this.state.uniqueId });
    }
}
