import { inject } from 'aurelia-framework';
import { PlatformStartup } from './platform/platform-startup';
import { PlotterConfig } from './platform/plotter-config';

@inject(PlatformStartup, PlotterConfig)
export class App {
  public message = 'Hello World!';

  constructor(private platformStartup: PlatformStartup, private plotterConfig: PlotterConfig) {}

  public activate() {
    this.plotterConfig.stateDirectoryName = (<any> window).plotterStateDirectoryName;

    this.platformStartup.start()
    .then(stateDirectory => {
        this.message = `Hello World! (started:${stateDirectory.hosts.length})`;
      }
    );
  }
}
