import { StateProvider } from './state-provider';

export class StateDirectory {
    public stateProviders: StateProvider[];
    public readOnly: boolean;
}
