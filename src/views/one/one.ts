import { inject } from 'aurelia-framework';
import { Shell } from '../../shell/shell';
import { PaneType } from '../../platform/pak/view';

@inject(Shell)
export class One {
    public model;
    public targetPane: PaneType = 'main';
    public targetMessage: string = 'some message from you...';

    constructor(private shell: Shell) { }

    public activate(model) {
        this.model = model;
    }

    public launchTarget() {
        // alert(`Launch Target: ${this.targetPane} / ${this.targetMessage}...`)
        this.shell.launchViewInstanceJSON(
            { 
                "uniqueId": "vi-05", 
                "viewId": "view3", 
                "paneType": this.targetPane, 
                "viewTemplate": null,
                "viewModel": "../views/one/one", 
                "viewState": { 
                    "a": this.targetMessage
                } 
            },
        );
    }
}
