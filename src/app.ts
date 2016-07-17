import { inject, Container } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
import { PlatformStartup } from './platform/platform-startup';
import { Plotter } from './platform/plotter';
import { StateDirectory } from './platform/state/state-directory';

@inject(PlatformStartup, Plotter, Container)
export class App {
  public router: Router;
  public message = 'Hello World!';

  constructor(
    private platformStartup: PlatformStartup,
    private plotterConfig: Plotter,
    private container: Container) {}

  public activate() {
    this.plotterConfig.stateDirectoryName = (<any> window).plotterStateDirectoryName;

    this.platformStartup.start()
      .then(stateDirectory => {
          this.message = `Hello World! (started:${stateDirectory.stateRepositories.length})`;
          this.container.registerInstance(StateDirectory, stateDirectory);
        }
    );
  }

  public configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Plotter-Platfrom';
    config.map([
      {route: ['', 'state'], name: 'state', moduleId: './state/state-repository-chooser', nav: false, title: 'State' },
      {route: 'session', name: 'session', moduleId: './state/state-session-chooser', nav: false, title: 'Session' },
      {route: 'shell', name: 'shell', moduleId: './shell/shell', nav: false, title: 'Shell' },
    ]);

    this.router = router;
  }
}
