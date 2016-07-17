import { StateDirectory } from './state/state-directory';
import { StateRepository } from './state/state-repository';
import { StateSession } from './state/state-session';

export class Plotter {
    public stateDirectoryName: string = 'state-directory';

    private myStateDirectory: StateDirectory;
    public get stateDirectory() {
        return this.myStateDirectory;
    }
    public set stateDirectory(value) {
        this.myStateDirectory = value;
    }

    private myStateRepository: StateRepository;
    public get stateRepository() {
        return this.myStateRepository;
    }
    public set stateRepository(value) {
        this.myStateRepository = value;
    }

    private myStateSession: StateSession;
    public get stateSession() {
        return this.myStateSession;
    }
    public set stateSession(value) {
        this.myStateSession = value;
    }
}
