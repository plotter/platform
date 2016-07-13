define('platform/platform-contracts',["require", "exports"], function (require, exports) {
    "use strict";
    exports.StateProviderTypes = ['service', 'localStorage'];
});

define('platform/state/state-directory',["require", "exports"], function (require, exports) {
    "use strict";
    var StateDirectory = (function () {
        function StateDirectory() {
        }
        return StateDirectory;
    }());
    exports.StateDirectory = StateDirectory;
});

define('platform/plotter-config',["require", "exports"], function (require, exports) {
    "use strict";
    var PlotterConfig = (function () {
        function PlotterConfig() {
            this.stateDirectoryName = 'state-directory';
        }
        return PlotterConfig;
    }());
    exports.PlotterConfig = PlotterConfig;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('platform/platform-startup',["require", "exports", 'aurelia-framework', 'aurelia-fetch-client', './state/state-directory', './state/state-provider', './plotter-config'], function (require, exports, aurelia_framework_1, aurelia_fetch_client_1, state_directory_1, state_provider_1, plotter_config_1) {
    "use strict";
    var PlatformStartup = (function () {
        function PlatformStartup(httpClient, plotterConfig) {
            this.httpClient = httpClient;
            this.plotterConfig = plotterConfig;
        }
        PlatformStartup.prototype.start = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var sdn = _this.plotterConfig.stateDirectoryName;
                alert("sdn: " + sdn);
                var stateDirectory = new state_directory_1.StateDirectory();
                stateDirectory.readOnly = false;
                stateDirectory.stateProviders = [
                    new state_provider_1.StateProvider()
                ];
                resolve(stateDirectory);
                if (sdn.toLowerCase().startsWith('service:')) { }
                else if (sdn.toLowerCase().startsWith('githubgist:')) {
                    reject('githubgist not supported yet.');
                }
                else if (sdn.toLowerCase().startsWith('localstorage:')) { }
                else {
                }
            });
        };
        PlatformStartup = __decorate([
            aurelia_framework_1.inject(aurelia_fetch_client_1.HttpClient, plotter_config_1.PlotterConfig), 
            __metadata('design:paramtypes', [aurelia_fetch_client_1.HttpClient, plotter_config_1.PlotterConfig])
        ], PlatformStartup);
        return PlatformStartup;
    }());
    exports.PlatformStartup = PlatformStartup;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app',["require", "exports", 'aurelia-framework', './platform/platform-startup', './platform/plotter-config'], function (require, exports, aurelia_framework_1, platform_startup_1, plotter_config_1) {
    "use strict";
    var App = (function () {
        function App(platformStartup, plotterConfig) {
            this.platformStartup = platformStartup;
            this.plotterConfig = plotterConfig;
            this.message = 'Hello World!';
        }
        App.prototype.activate = function () {
            var _this = this;
            this.plotterConfig.stateDirectoryName = window.plotterStateDirectoryName;
            this.platformStartup.start()
                .then(function (stateDirectory) {
                _this.message = "Hello World! (started:" + stateDirectory.stateProviders.length + ")";
            });
        };
        App = __decorate([
            aurelia_framework_1.inject(platform_startup_1.PlatformStartup, plotter_config_1.PlotterConfig), 
            __metadata('design:paramtypes', [platform_startup_1.PlatformStartup, plotter_config_1.PlotterConfig])
        ], App);
        return App;
    }());
    exports.App = App;
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true,
    };
});

define('main',["require", "exports", './environment'], function (require, exports, environment_1) {
    "use strict";
    Promise.config({
        warnings: {
            wForgottenReturn: false,
        },
    });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources');
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
    }
    exports.configure = configure;
});

define('platform/pak/pak-directory',["require", "exports"], function (require, exports) {
    "use strict";
    var PakDirectory = (function () {
        function PakDirectory() {
        }
        PakDirectory.fromJSON = function (json) {
            var pakDirectory = new PakDirectory();
            return pakDirectory;
        };
        PakDirectory.prototype.toJSON = function () {
            return JSON.stringify(this);
        };
        return PakDirectory;
    }());
    exports.PakDirectory = PakDirectory;
});



define("platform/pak/pak-provider-local-storage", [],function(){});



define("platform/pak/pak-provider-service", [],function(){});



define("platform/pak/pak-provider", [],function(){});

define('platform/state/state-provider-github-gist',["require", "exports"], function (require, exports) {
    "use strict";
    var StateProviderGitHubGist = (function () {
        function StateProviderGitHubGist() {
        }
        return StateProviderGitHubGist;
    }());
    exports.StateProviderGitHubGist = StateProviderGitHubGist;
});

define('platform/state/state-provider-local-storage',["require", "exports"], function (require, exports) {
    "use strict";
    var StateProviderLocalStorage = (function () {
        function StateProviderLocalStorage() {
        }
        return StateProviderLocalStorage;
    }());
    exports.StateProviderLocalStorage = StateProviderLocalStorage;
});

define('platform/state/state-provider-service',["require", "exports"], function (require, exports) {
    "use strict";
    var StateProviderService = (function () {
        function StateProviderService() {
        }
        return StateProviderService;
    }());
    exports.StateProviderService = StateProviderService;
});

define('platform/state/state-provider',["require", "exports"], function (require, exports) {
    "use strict";
    var StateProvider = (function () {
        function StateProvider() {
        }
        return StateProvider;
    }());
    exports.StateProvider = StateProvider;
});

define('../test/unit/app.spec',["require", "exports", '../../src/app', '../../src/platform/platform-startup', '../../src/platform/plotter-config', 'aurelia-fetch-client'], function (require, exports, app_1, platform_startup_1, plotter_config_1, aurelia_fetch_client_1) {
    "use strict";
    describe('the app', function () {
        it('says hello', function () {
            var httpMock = new aurelia_fetch_client_1.HttpClient();
            httpMock.fetch = function (url) { return Promise.resolve({
                json: function () { return []; },
            }); };
            var plotterConfig = new plotter_config_1.PlotterConfig();
            expect(new app_1.App(new platform_startup_1.PlatformStartup(httpMock, plotterConfig), plotterConfig).message).toBe('Hello World!');
        });
        it('true is true', function () {
            expect(true).toBe(true);
        });
    });
});

define('../test/unit/setup',["require", "exports", 'aurelia-pal-browser', 'aurelia-polyfills'], function (require, exports, aurelia_pal_browser_1) {
    "use strict";
    aurelia_pal_browser_1.initialize();
});

define('../test/unit/platform/platform-startup.spec',["require", "exports", 'aurelia-fetch-client', '../../../src/platform/platform-startup', '../../../src/platform/plotter-config'], function (require, exports, aurelia_fetch_client_1, platform_startup_1, plotter_config_1) {
    "use strict";
    describe('platform startup class', function () {
        it('returns a promise of type platform config', function () {
            var plotterConfig = new plotter_config_1.PlotterConfig();
            var platformStartup = new platform_startup_1.PlatformStartup(new aurelia_fetch_client_1.HttpClient(), plotterConfig);
            var ret = platformStartup.start();
            expect(ret instanceof Promise).toBe(true);
        });
        it('resolves the promise', (function (done) {
            var plotterConfig = new plotter_config_1.PlotterConfig();
            var platformStartup = new platform_startup_1.PlatformStartup(new aurelia_fetch_client_1.HttpClient(), plotterConfig);
            platformStartup.start()
                .then(function (stateDirectory) {
                expect(stateDirectory.stateProviders.length).toBe(1);
                done();
            });
        }));
        it('true is true', function () {
            expect(true).toBe(true);
        });
    });
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <h1>${message}</h1>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map