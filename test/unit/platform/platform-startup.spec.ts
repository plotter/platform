import { StateConfig} from '../../../src/platform/state-config/state-config';
import { platformStartup } from '../../../src/platform/platform-startup';

describe('platform startup function', () => {
  it('returns a promise of type platform config', () => {
    let ret = platformStartup();
    expect(ret instanceof Promise).toBe(true);
  });
  it('resolves the promise', ((done) => {
      console.log('begin tests...');
    platformStartup().then(stateConfig => {
        console.log('in resolve...');
        expect(stateConfig.providers.length).toBe(1);
        done();
    });
  }));
  it ('true is true', () => {
    expect(true).toBe(true);
  })
});
