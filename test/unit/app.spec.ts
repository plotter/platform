import {App} from '../../src/app';
import {PlatformStartup} from '../../src/platform/platform-startup';
import {PlotterConfig} from '../../src/platform/plotter-config';
import {HttpClient} from 'aurelia-fetch-client';

describe('the app', () => {
  it('says hello', () => {

    let httpMock = new HttpClient();
    httpMock.fetch = url => Promise.resolve({
      json: () => [],
    });

    let plotterConfig = new PlotterConfig();
    expect(new App(new PlatformStartup(httpMock, plotterConfig), plotterConfig).message).toBe('Hello World!');
  });
  it('true is true', () => {
    expect(true).toBe(true);
  });
});
