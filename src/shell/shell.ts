import { inject } from 'aurelia-framework';
import { StateDirectory } from '../platform/state/state-directory';
import { StateSession } from '../platform/state/state-session';
import { ViewInstance } from '../platform/state/view-instance';

@inject(StateDirectory)
export class Shell {
    public hostId: string;
    public sessionId: string;
    public session: StateSession;

    public navViewInstances = new Array<ViewInstance>();
    public mainViewInstances = new Array<ViewInstance>();
    public altViewInstances = new Array<ViewInstance>();

    constructor(private stateDirectory: StateDirectory) { }

    public activate(params) {
        let that = this;

        this.hostId = params.hostId;
        this.sessionId = params.sessionId;

        this.stateDirectory.getStateSession(this.hostId, this.sessionId)
            .then(session => {
                that.session = session;

                that.session.activePaks.forEach(activePak => {
                    activePak.viewInstances.forEach(viewInstance => {
                        switch (viewInstance.paneType) {
                            case 'nav':
                            that.navViewInstances.push(viewInstance);
                            break;

                            case 'main':
                            that.mainViewInstances.push(viewInstance);
                            break;

                            case 'alt':
                            that.altViewInstances.push(viewInstance);
                            break;

                            default:
                            break;
                        }
                    });
                });
            });
    }
}
