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
    public navActiveViewInstance;

    public mainViewInstances = new Array<ViewInstance>();
    public mainActiveViewInstance;

    public altViewInstances = new Array<ViewInstance>();
    public altActiveViewInstance;

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
                            if (!that.navActiveViewInstance) {
                                that.navActiveViewInstance = viewInstance;
                            }
                            break;

                            case 'main':
                            that.mainViewInstances.push(viewInstance);
                            if (!that.mainActiveViewInstance) {
                                that.mainActiveViewInstance = viewInstance;
                            }
                            break;

                            case 'alt':
                            that.altViewInstances.push(viewInstance);
                            if (!that.altActiveViewInstance) {
                                that.altActiveViewInstance = viewInstance;
                            }
                            break;

                            default:
                            break;
                        }
                    });
                });
            });
    }
}
