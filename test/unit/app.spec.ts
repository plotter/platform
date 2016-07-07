import {App} from '../../src/app';

describe('the app', () => {
  it('says hello', () => {
    expect(new App().message).toBe('Hello World!');
  });
  it ('true is true', () => {
    expect(true).toBe(true);
  })
});
