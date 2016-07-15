import { HttpClient } from 'aurelia-fetch-client';
import { StateDirectory } from '../../../src/platform/state/state-directory';
import { PlatformStartup } from '../../../src/platform/platform-startup';
import { PlotterConfig } from '../../../src/platform/plotter-config';

describe('platform startup class', () => {
  it('returns a promise of type platform config', () => {
    let plotterConfig = new PlotterConfig();
    let platformStartup = new PlatformStartup(new HttpClient(), plotterConfig);
    let ret = platformStartup.start();
    expect(ret instanceof Promise).toBe(true);
  });
  it('resolves the promise', ((done) => {
    let plotterConfig = new PlotterConfig();
    let httpClient = new HttpClient();
    httpClient.baseUrl = 'http://localhost:9000/';
    let platformStartup = new PlatformStartup(httpClient, plotterConfig);
    platformStartup.start()
      .then(stateDirectory => {
        expect(stateDirectory.stateRepositories.length).toBe(1);
        done();
      })
      .catch(reason => {
        expect(true).toBe(false);
        alert(`start failed: ${reason}`);
        done();
      });
  }));
  it('true is true', () => {
    expect(true).toBe(true);
  });
});
