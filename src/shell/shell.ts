import { inject } from 'aurelia-framework';
import { StateDirectory } from '../platform/state/state-directory';
import { StateSession } from '../platform/state/state-session';

@inject(StateDirectory)
export class Shell {
    public hostId: string;
    public sessionId: string;
    public session: StateSession;

    constructor(private stateDirectory: StateDirectory) { }

    public activate(params) {
        this.hostId = params.hostId;
        this.sessionId = params.sessionId;

        this.stateDirectory.getStateSession(this.hostId, this.sessionId)
            .then(session => {
                this.session = session;
            });
    }
}
