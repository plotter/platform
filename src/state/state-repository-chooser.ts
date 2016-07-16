import { inject } from 'aurelia-framework';
import { StateDirectory } from '../platform/state/state-directory';
import { StateRepository } from '../platform/state/state-repository';

@inject(StateDirectory)
export class StateRepositoryChooser {
    public states: StateRepository[];
    public state: StateRepository;

    constructor(private stateDirectory: StateDirectory) {
        this.states = stateDirectory.stateRepositories;
    }

    public choose = () => {
        alert(`chose: ${this.state.uniqueId}`);
    }

    public activate(params) {
    }

    public stringify(o: Object) {
        let props = Object.getOwnPropertyNames(o);
        if (!props.length) {
            return 'no props';
        }

        return props
            .map(name => `name: ${name}, value: ${o[name]}`)
            .join('\r\n')
    }
}
