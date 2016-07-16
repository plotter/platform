import {App} from '../../src/app';
import {PlatformStartup} from '../../src/platform/platform-startup';
import {PlotterConfig} from '../../src/platform/plotter-config';
import {Container} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

describe('the app', () => {
  it('says hello', () => {

    let httpMock = new HttpClient();
    httpMock.fetch = url => Promise.resolve({
      json: () => [],
    });

    let plotterConfig = new PlotterConfig();
    let container = new Container();
    let platformStartup = new PlatformStartup(httpMock, plotterConfig);
    expect(new App(platformStartup, plotterConfig, container).message).toBe('Hello World!');
  });
  it('true is true', () => {
    expect(true).toBe(true);
  });
});
