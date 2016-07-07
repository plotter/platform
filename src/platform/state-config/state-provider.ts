export interface StateProvider {
    type: StateProviderType;
}

export enum StateProviderType {
    service,
    localStorage
}
