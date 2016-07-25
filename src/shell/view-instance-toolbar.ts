import { customElement, bindable } from 'aurelia-framework';
import { ViewInstance } from '../platform/state/view-instance';

@customElement('view-instance-toolbar')
export class ViewInstanceToolbar {
    @bindable() public activeViewInstance: ViewInstance;
    @bindable() public viewInstances: ViewInstance[];
}
