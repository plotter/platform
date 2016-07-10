export interface StateProvider {
    stateProvider: string;
}

export interface StateHost {
    stateProviderType: string;
}

export var StateProviderTypes = ['service', 'localStorage'];
