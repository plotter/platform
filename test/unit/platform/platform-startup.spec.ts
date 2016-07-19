import { HttpClient } from 'aurelia-fetch-client';
import { PlatformStartup } from '../../../src/platform/platform-startup';
import { Plotter } from '../../../src/platform/plotter';

describe('platform startup class', () => {
  it('returns a promise of type platform config', () => {
    let plotterConfig = new Plotter();
    let platformStartup = new PlatformStartup(new HttpClient(), plotterConfig);
    let ret = platformStartup.start();
    expect(ret instanceof Promise).toBe(true);
  });
  it('resolves the promise', ((done) => {
    let plotterConfig = new Plotter();
    let httpClient = new HttpClient();
    httpClient.baseUrl = 'http://localhost:9000/';
    let platformStartup = new PlatformStartup(httpClient, plotterConfig);
    platformStartup.start()
      .then(stateDirectory => {
        expect(stateDirectory.stateRepositories.length).toBe(2);
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
