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
    let platformStartup = new PlatformStartup(new HttpClient(), plotterConfig);
    platformStartup.start()
      .then(stateDirectory => {
        expect(stateDirectory.hosts.length).toBe(1);
        done();
      });
  }));
  it('true is true', () => {
    expect(true).toBe(true);
  });
});
