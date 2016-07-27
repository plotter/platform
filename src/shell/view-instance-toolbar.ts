import { customElement, bindable } from 'aurelia-framework';
import { ViewInstance } from '../platform/state/view-instance';

@customElement('view-instance-toolbar')
export class ViewInstanceToolbar {
    @bindable() public activeViewInstance: ViewInstance;
    @bindable() public viewInstances: ViewInstance[];
    @bindable() public showTitle: boolean;

    public removeItem = (vi: ViewInstance, index: number, viArr: ViewInstance[]) => {
        viArr.splice(index, 1);
        if (this.activeViewInstance === vi && viArr.length > 0) {
            this.activeViewInstance = viArr[0];
        }
    }
}
