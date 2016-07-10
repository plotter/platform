import { StateHost } from './state-provider';

export interface StateDirectory {
    hosts: StateHost[];
    readOnly: boolean;
}
