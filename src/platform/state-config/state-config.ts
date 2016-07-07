import { StateProvider } from './state-provider';

export interface StateConfig {
    providers: StateProvider[];
    readOnly: boolean;
}
