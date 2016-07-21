import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { StateDirectory } from '../platform/state/state-directory';
import { StateRepository } from '../platform/state/state-repository';
import { Plotter } from '../platform/plotter';

@inject(StateDirectory, Plotter, Router)
export class StateSessionChooser {
    public stateRepoUniqueId: string;
    public stateRepo: StateRepository;
    public message: string = 'no message.';
    public sessionList: string[] = [];
    public sessionId: string;

    constructor(private stateDirectory: StateDirectory, private plotter: Plotter, private router: Router) { }

    public activate(params) {
        let that = this;

        this.stateRepoUniqueId = params.hostId;
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
        let that = this;

        if (!this.sessionId) {
            // route to new-session
            this.router.navigateToRoute('newSession', { hostId: this.stateRepoUniqueId });
            return;
        }

        // route to shell
        this.stateDirectory.getStateSession(this.stateRepoUniqueId, this.sessionId)
            .then(stateSession => {
                that.plotter.stateSession = stateSession;
                that.router.navigateToRoute('shell', { hostId: that.stateRepoUniqueId, sessionId: that.sessionId });
            });
    }
}
