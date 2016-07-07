define('app',["require", "exports"], function (require, exports) {
    "use strict";
    var App = (function () {
        function App() {
            this.message = 'Hello World!';
        }
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

define('platform/state-config/state-provider',["require", "exports"], function (require, exports) {
    "use strict";
    (function (StateProviderType) {
        StateProviderType[StateProviderType["service"] = 0] = "service";
        StateProviderType[StateProviderType["localStorage"] = 1] = "localStorage";
    })(exports.StateProviderType || (exports.StateProviderType = {}));
    var StateProviderType = exports.StateProviderType;
});

define('platform/state-config/state-config',["require", "exports"], function (require, exports) {
    "use strict";
});

define('platform/platform-startup',["require", "exports", './state-config/state-provider'], function (require, exports, state_provider_1) {
    "use strict";
    function platformStartup() {
        return new Promise(function (resolve, reject) {
            var stateConfig = {
                providers: [
                    { type: state_provider_1.StateProviderType.localStorage },
                ],
                readOnly: false,
            };
            resolve(stateConfig);
        });
    }
    exports.platformStartup = platformStartup;
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
    }
    exports.configure = configure;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <h1>${message}</h1>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map