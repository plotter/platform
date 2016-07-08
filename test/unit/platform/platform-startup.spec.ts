import { HttpClient } from 'aurelia-fetch-client'
import { StateConfig} from '../../../src/platform/state-config/state-config';
import { PlatformStartup } from '../../../src/platform/platform-startup';

describe('platform startup class', () => {
  it('returns a promise of type platform config', () => {
    let platformStartup = new PlatformStartup(new HttpClient());
    let ret = platformStartup.start();
    expect(ret instanceof Promise).toBe(true);
  });
  it('resolves the promise', ((done) => {
    let platformStartup = new PlatformStartup(new HttpClient());
    platformStartup.start()
      .then(stateConfig => {
        expect(stateConfig.providers.length).toBe(1);
        done();
      });
  }));
  it('true is true', () => {
    expect(true).toBe(true);
  })
});
