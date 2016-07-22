define('platform/pak/view',["require", "exports"], function (require, exports) {
    "use strict";
    var View = (function () {
        function View() {
        }
        View.fromJSON = function (json) {
            var view = new View();
            view.locked = json.locked;
            view.uniqueId = json.uniqueId;
            view.pane = json.pane;
            view.moduleUrl = json.moduleUrl;
            return view;
        };
        return View;
    }());
    exports.View = View;
});

define('platform/pak/pak',["require", "exports", './view'], function (require, exports, view_1) {
    "use strict";
    var Pak = (function () {
        function Pak() {
        }
        Pak.fromJSON = function (json) {
            var pak = new Pak();
            pak.locked = json.locked;
            pak.uniqueId = json.uniqueId;
            pak.views = json.views.map(function (viewJson) {
                var view = view_1.View.fromJSON(viewJson);
                view.pak = pak;
                return view;
            });
            return pak;
        };
        Pak.prototype.getView = function (viewId) {
            var views = this.views.filter(function (view) { return view.uniqueId === viewId; });
            if (views.length > 0) {
                return views[0];
            }
            return null;
        };
        return Pak;
    }());
    exports.Pak = Pak;
});

define('platform/pak/pak-repository',["require", "exports"], function (require, exports) {
    "use strict";
});

define('platform/pak/pak-repository-file',["require", "exports", './pak'], function (require, exports, pak_1) {
    "use strict";
    var PakRepositoryFile = (function () {
        function PakRepositoryFile(httpClient) {
            var _this = this;
            this.httpClient = httpClient;
            this.locked = false;
            this.uniqueId = 'state-provider';
            this.pakRepositoryType = 'File';
            this.pakMap = new Map();
            this.pakPromiseMap = new Map();
            this.getPak = function (pakId) {
                if (_this.pakPromiseMap.has(pakId)) {
                    return _this.pakPromiseMap.get(pakId);
                }
                var that = _this;
                var pakPromise = new Promise(function (resolve, reject) {
                    that.httpClient.fetch(that.path + "/" + that.uniqueId + "/" + pakId + ".json")
                        .then(function (response) {
                        return response.json();
                    })
                        .then(function (data) {
                        var pak = pak_1.Pak.fromJSON(data);
                        pak.pakRepository = that;
                        that.pakMap.set(pakId, pak);
                        resolve(pak);
                    })
                        .catch(function (reason) {
                        reject(new Error("fetch session list: reason: \r\n\r\n" + reason));
                    });
                });
                _this.pakPromiseMap.set(pakId, pakPromise);
                return pakPromise;
            };
            this.getPakList = function () {
                var that = _this;
                return new Promise(function (resolve, reject) {
                    that.httpClient.fetch(that.path + "/" + that.uniqueId + "/pak-list.json")
                        .then(function (response) {
                        return response.json();
                    })
                        .then(function (data) {
                        that.pakList = data.pakList;
                        resolve(data.pakList);
                    })
                        .catch(function (reason) {
                        reject(new Error("fetch pak list failed: reason: \r\n\r\n" + reason));
                    });
                });
            };
        }
        return PakRepositoryFile;
    }());
    exports.PakRepositoryFile = PakRepositoryFile;
});

define('platform/pak/pak-directory',["require", "exports", 'aurelia-fetch-client', './pak-repository-file'], function (require, exports, aurelia_fetch_client_1, pak_repository_file_1) {
    "use strict";
    var PakDirectory = (function () {
        function PakDirectory() {
        }
        PakDirectory.fromJSON = function (json) {
            var pakDirectory = new PakDirectory();
            pakDirectory.locked = json.locked;
            pakDirectory.uniqueId = json.uniqueId;
            pakDirectory.pakRepositories = json.pakRepositories.map(function (pakRepositoryJSON) {
                switch (pakRepositoryJSON.pakRepositoryType) {
                    case 'File':
                        {
                            var pakRepository = new pak_repository_file_1.PakRepositoryFile(new aurelia_fetch_client_1.HttpClient());
                            pakRepository.locked = pakRepositoryJSON.locked;
                            pakRepository.uniqueId = pakRepositoryJSON.uniqueId;
                            pakRepository.pakRepositoryType = pakRepositoryJSON.pakRepositoryType;
                            pakRepository.path = pakRepositoryJSON.path;
                            pakRepository.pakDirectory = pakDirectory;
                            return pakRepository;
                        }
                    default:
                        throw new Error("repository " + pakRepositoryJSON.pakRepositoryType + " not supported.");
                }
            });
            return pakDirectory;
        };
        PakDirectory.prototype.toJSON = function () {
            return JSON.parse(JSON.stringify(this));
        };
        return PakDirectory;
    }());
    exports.PakDirectory = PakDirectory;
});

define('platform/state/view-instance',["require", "exports"], function (require, exports) {
    "use strict";
    var ViewInstance = (function () {
        function ViewInstance() {
        }
        ViewInstance.fromJSON = function (json) {
            var viewInstance = new ViewInstance();
            viewInstance.uniqueId = json.uniqueId;
            viewInstance.viewId = json.viewId;
            viewInstance.viewState = json.viewState;
            viewInstance.paneType = json.paneType;
            return viewInstance;
        };
        ViewInstance.prototype.getView = function () {
            if (this.viewPromise) {
                return this.viewPromise;
            }
            var that = this;
            return this.viewPromise = that.activePak.stateSession.stateRepository.getPakDirectory()
                .then(function (pakDirectory) {
                var pakHosts = pakDirectory.pakRepositories.filter(function (pr) { return pr.uniqueId === that.activePak.pakHostId; });
                if (pakHosts.length >= 1) {
                    var pakHost = pakHosts[0];
                    return pakHost.getPak(that.activePak.pakId)
                        .then(function (pak) {
                        var view = pak.getView(that.viewId);
                        return view;
                    });
                }
                else {
                    throw (new Error("Failed to get pak - couldn't find pakHost(" + that.activePak.pakHostId + ")"));
                }
            });
        };
        return ViewInstance;
    }());
    exports.ViewInstance = ViewInstance;
});

define('platform/state/active-pak',["require", "exports", './view-instance'], function (require, exports, view_instance_1) {
    "use strict";
    var ActivePak = (function () {
        function ActivePak() {
        }
        ActivePak.fromJSON = function (json) {
            var activePak = new ActivePak();
            activePak.locked = json.locked;
            activePak.uniqueId = json.uniqueId;
            activePak.pakHostId = json.pakHostId;
            activePak.pakId = json.pakId;
            activePak.viewInstances = json.viewInstances.map(function (viewInstanceJson) {
                var viewInstance = view_instance_1.ViewInstance.fromJSON(viewInstanceJson);
                viewInstance.activePak = activePak;
                return viewInstance;
            });
            setTimeout(function () { return activePak.getPak(); }, 0);
            return activePak;
        };
        ActivePak.prototype.getPak = function () {
            if (this.pakPromise) {
                return this.pakPromise;
            }
            var that = this;
            return this.pakPromise = that.stateSession.stateRepository.getPakDirectory()
                .then(function (pakDirectory) {
                var pakHosts = pakDirectory.pakRepositories.filter(function (pr) { return pr.uniqueId === that.pakHostId; });
                if (pakHosts.length >= 1) {
                    var pakHost = pakHosts[0];
                    return pakHost.getPak(that.pakId)
                        .then(function (pak) {
                        that.pak = pak;
                        return pak;
                    });
                }
                else {
                    throw (new Error("Failed to get pak - couldn't find pakHost(" + that.pakHostId + ")"));
                }
            });
        };
        return ActivePak;
    }());
    exports.ActivePak = ActivePak;
});

define('platform/state/state-session',["require", "exports", './active-pak'], function (require, exports, active_pak_1) {
    "use strict";
    var StateSession = (function () {
        function StateSession() {
            this.activePaks = [];
        }
        StateSession.fromJSON = function (json) {
            var stateSession = new StateSession();
            stateSession.locked = json.locked;
            stateSession.uniqueId = json.uniqueId;
            stateSession.activePaks = json.activePaks.map(function (activePakJson) {
                var activePak = active_pak_1.ActivePak.fromJSON(activePakJson);
                activePak.stateSession = stateSession;
                return activePak;
            });
            return stateSession;
        };
        return StateSession;
    }());
    exports.StateSession = StateSession;
});

define('platform/state/state-repository',["require", "exports"], function (require, exports) {
    "use strict";
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
define('platform/state/state-repository-file',["require", "exports", 'aurelia-framework', 'aurelia-fetch-client', '../pak/pak-directory', './state-session'], function (require, exports, aurelia_framework_1, aurelia_fetch_client_1, pak_directory_1, state_session_1) {
    "use strict";
    var StateRepositoryFile = (function () {
        function StateRepositoryFile(httpClient) {
            var _this = this;
            this.httpClient = httpClient;
            this.locked = false;
            this.uniqueId = 'state-repository';
            this.stateRepositoryType = 'File';
            this.stateSessionPromiseMap = new Map();
            this.stateSessionMap = new Map();
            this.getPakDirectory = function () {
                if (_this.pakDirectoryPromise) {
                    return _this.pakDirectoryPromise;
                }
                var that = _this;
                return _this.pakDirectoryPromise = new Promise(function (resolve, reject) {
                    that.httpClient.fetch(that.path + "/" + that.uniqueId + "/pak-directory.json")
                        .then(function (response) {
                        return response.json();
                    })
                        .then(function (data) {
                        var pakDirectory = pak_directory_1.PakDirectory.fromJSON(data);
                        pakDirectory.stateRepository = that;
                        resolve(pakDirectory);
                    })
                        .catch(function (reason) {
                        reject(new Error("fetch pak-directory failed: reason: \r\n\r\n" + reason));
                    });
                });
            };
        }
        StateRepositoryFile.fromJSON = function (json) {
            var stateRepository = new StateRepositoryFile(new aurelia_fetch_client_1.HttpClient());
            stateRepository.locked = json.locked;
            stateRepository.uniqueId = json.uniqueId;
            stateRepository.stateRepositoryType = json.stateRepositoryType;
            stateRepository.path = json.path;
            return stateRepository;
        };
        StateRepositoryFile.prototype.getStateSession = function (sessionId) {
            if (this.stateSessionPromiseMap.has(sessionId)) {
                return this.stateSessionPromiseMap.get(sessionId);
            }
            var that = this;
            var stateSessionPromise = new Promise(function (resolve, reject) {
                that.httpClient.fetch(that.path + "/" + that.uniqueId + "/" + sessionId + ".json")
                    .then(function (response) {
                    return response.json();
                })
                    .then(function (data) {
                    var stateSession = state_session_1.StateSession.fromJSON(data);
                    stateSession.stateRepository = that;
                    that.stateSessionMap.set(sessionId, stateSession);
                    resolve(stateSession);
                })
                    .catch(function (reason) {
                    reject(new Error("fetch session list: reason: \r\n\r\n" + reason));
                });
            });
            this.stateSessionPromiseMap.set(sessionId, stateSessionPromise);
            return stateSessionPromise;
        };
        StateRepositoryFile.prototype.getSessionList = function () {
            var that = this;
            return new Promise(function (resolve, reject) {
                that.httpClient.fetch(that.path + "/" + that.uniqueId + "/session-list.json")
                    .then(function (response) {
                    return response.json();
                })
                    .then(function (data) {
                    resolve(data.sessionList);
                })
                    .catch(function (reason) {
                    reject(new Error("fetch session list: reason: \r\n\r\n" + reason));
                });
            });
        };
        StateRepositoryFile.prototype.toJSON = function () {
            return {
                locked: this.locked,
                stateRepositoryType: this.stateRepositoryType,
                uniqueId: this.uniqueId,
                path: this.path,
            };
        };
        StateRepositoryFile = __decorate([
            aurelia_framework_1.inject(aurelia_fetch_client_1.HttpClient), 
            __metadata('design:paramtypes', [aurelia_fetch_client_1.HttpClient])
        ], StateRepositoryFile);
        return StateRepositoryFile;
    }());
    exports.StateRepositoryFile = StateRepositoryFile;
});

define('platform/state/state-directory',["require", "exports", 'aurelia-fetch-client', './state-repository-file'], function (require, exports, aurelia_fetch_client_1, state_repository_file_1) {
    "use strict";
    var StateDirectory = (function () {
        function StateDirectory() {
        }
        StateDirectory.fromJSON = function (json) {
            var stateDirectory = new StateDirectory();
            stateDirectory.locked = json.locked;
            stateDirectory.uniqueId = json.uniqueId;
            stateDirectory.stateRepositories = json.stateRepositories.map(function (stateRepositoryJSON) {
                switch (stateRepositoryJSON.stateRepositoryType) {
                    case 'File':
                        {
                            var stateRepository = new state_repository_file_1.StateRepositoryFile(new aurelia_fetch_client_1.HttpClient());
                            stateRepository.locked = stateRepositoryJSON.locked;
                            stateRepository.uniqueId = stateRepositoryJSON.uniqueId;
                            stateRepository.stateRepositoryType = stateRepositoryJSON.stateRepositoryType;
                            stateRepository.path = stateRepositoryJSON.path;
                            stateRepository.stateDirectory = stateDirectory;
                            return stateRepository;
                        }
                    default:
                        throw new Error("repository " + stateRepositoryJSON.stateRepositoryType + " not supported.");
                }
            });
            return stateDirectory;
        };
        StateDirectory.prototype.getStateRepository = function (uniqueId) {
            if (!uniqueId && this.stateRepositories.length > 0) {
                return this.stateRepositories[0];
            }
            var repoMatch = null;
            this.stateRepositories.some(function (repo) {
                if (repo.uniqueId === uniqueId) {
                    repoMatch = repo;
                    return true;
                }
                return false;
            });
            return repoMatch;
        };
        StateDirectory.prototype.getStateSession = function (stateRepositoryId, stateSessionId) {
            var repo = this.getStateRepository(stateRepositoryId);
            if (!repo) {
                throw new Error("Could not retrieve repository: " + stateRepositoryId);
            }
            return repo.getStateSession(stateSessionId);
        };
        StateDirectory.prototype.toJSON = function () {
            return {
                locked: this.locked,
                stateRepositories: this.stateRepositories.map(function (stateRepository) { return stateRepository.toJSON(); }),
                uniqueId: this.uniqueId,
            };
        };
        return StateDirectory;
    }());
    exports.StateDirectory = StateDirectory;
});

define('platform/plotter',["require", "exports"], function (require, exports) {
    "use strict";
    var Plotter = (function () {
        function Plotter() {
            this.stateDirectoryName = 'state-directory';
        }
        Object.defineProperty(Plotter.prototype, "stateDirectory", {
            get: function () {
                return this.myStateDirectory;
            },
            set: function (value) {
                this.myStateDirectory = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Plotter.prototype, "stateRepository", {
            get: function () {
                return this.myStateRepository;
            },
            set: function (value) {
                this.myStateRepository = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Plotter.prototype, "stateSession", {
            get: function () {
                return this.myStateSession;
            },
            set: function (value) {
                this.myStateSession = value;
            },
            enumerable: true,
            configurable: true
        });
        return Plotter;
    }());
    exports.Plotter = Plotter;
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
define('platform/platform-startup',["require", "exports", 'aurelia-framework', 'aurelia-fetch-client', './state/state-directory', './plotter'], function (require, exports, aurelia_framework_1, aurelia_fetch_client_1, state_directory_1, plotter_1) {
    "use strict";
    var PlatformStartup = (function () {
        function PlatformStartup(httpClient, plotter) {
            this.httpClient = httpClient;
            this.plotter = plotter;
        }
        PlatformStartup.prototype.start = function () {
            var _this = this;
            var that = this;
            return new Promise(function (resolve, reject) {
                var sdn = that.plotter.stateDirectoryName;
                if (sdn.toLowerCase().startsWith('service:')) {
                    reject('service not supported yet.');
                }
                else if (sdn.toLowerCase().startsWith('githubgist:')) {
                    reject('githubgist not supported yet.');
                }
                else if (sdn.toLowerCase().startsWith('localstorage:')) {
                    reject('localstorage not supported yet.');
                }
                else {
                    that.httpClient.fetch(sdn + ".json")
                        .then(function (response) {
                        return response.json();
                    })
                        .then(function (data) {
                        var stateDirectory = state_directory_1.StateDirectory.fromJSON(data);
                        _this.plotter.stateDirectory = stateDirectory;
                        resolve(stateDirectory);
                    })
                        .catch(function (reason) {
                        reject(new Error("fetch state-dictionary2: reason: \r\n\r\n" + reason));
                    });
                }
            });
        };
        PlatformStartup = __decorate([
            aurelia_framework_1.inject(aurelia_fetch_client_1.HttpClient, plotter_1.Plotter), 
            __metadata('design:paramtypes', [aurelia_fetch_client_1.HttpClient, plotter_1.Plotter])
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
define('app',["require", "exports", 'aurelia-framework', './platform/platform-startup', './platform/plotter', './platform/state/state-directory'], function (require, exports, aurelia_framework_1, platform_startup_1, plotter_1, state_directory_1) {
    "use strict";
    var App = (function () {
        function App(platformStartup, plotterConfig, container) {
            this.platformStartup = platformStartup;
            this.plotterConfig = plotterConfig;
            this.container = container;
            this.message = 'Hello World!';
        }
        App.prototype.activate = function () {
            var _this = this;
            this.plotterConfig.stateDirectoryName = window.plotterStateDirectoryName;
            return this.platformStartup.start()
                .then(function (stateDirectory) {
                _this.message = "Hello World! (started:" + stateDirectory.stateRepositories.length + ")";
                _this.container.registerInstance(state_directory_1.StateDirectory, stateDirectory);
                return stateDirectory;
            });
        };
        App.prototype.configureRouter = function (config, router) {
            config.title = 'Plotter-Platfrom';
            config.map([
                { route: ['', 'state'], name: 'state', moduleId: './state/state-repository-chooser', nav: false, title: 'State' },
                { route: 'session', name: 'session', moduleId: './state/state-session-chooser', nav: false, title: 'Session' },
                { route: 'new-session', name: 'newSession', moduleId: './state/new-session', nav: false, title: 'New Session' },
                { route: 'shell', name: 'shell', moduleId: './shell/shell', nav: false, title: 'Shell' },
            ]);
            this.router = router;
        };
        App = __decorate([
            aurelia_framework_1.inject(platform_startup_1.PlatformStartup, plotter_1.Plotter, aurelia_framework_1.Container), 
            __metadata('design:paramtypes', [platform_startup_1.PlatformStartup, plotter_1.Plotter, aurelia_framework_1.Container])
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

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('shell/shell',["require", "exports", 'aurelia-framework', '../platform/state/state-directory'], function (require, exports, aurelia_framework_1, state_directory_1) {
    "use strict";
    var Shell = (function () {
        function Shell(stateDirectory) {
            this.stateDirectory = stateDirectory;
            this.navViewInstances = new Array();
            this.mainViewInstances = new Array();
            this.altViewInstances = new Array();
        }
        Shell.prototype.activate = function (params) {
            var that = this;
            this.hostId = params.hostId;
            this.sessionId = params.sessionId;
            this.stateDirectory.getStateSession(this.hostId, this.sessionId)
                .then(function (session) {
                that.session = session;
                that.session.activePaks.forEach(function (activePak) {
                    activePak.viewInstances.forEach(function (viewInstance) {
                        switch (viewInstance.paneType) {
                            case 'nav':
                                that.navViewInstances.push(viewInstance);
                                break;
                            case 'main':
                                that.mainViewInstances.push(viewInstance);
                                break;
                            case 'alt':
                                that.altViewInstances.push(viewInstance);
                                break;
                            default:
                                break;
                        }
                    });
                });
            });
        };
        Shell = __decorate([
            aurelia_framework_1.inject(state_directory_1.StateDirectory), 
            __metadata('design:paramtypes', [state_directory_1.StateDirectory])
        ], Shell);
        return Shell;
    }());
    exports.Shell = Shell;
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
define('state/new-session',["require", "exports", 'aurelia-framework', '../platform/state/state-directory'], function (require, exports, aurelia_framework_1, state_directory_1) {
    "use strict";
    var NewSession = (function () {
        function NewSession(stateDirectory) {
            this.stateDirectory = stateDirectory;
        }
        NewSession.prototype.activate = function (params) {
            var that = this;
            this.hostId = params.hostId;
            this.stateRepository = this.stateDirectory.getStateRepository(this.hostId);
            this.stateRepository.getPakDirectory()
                .then(function (pakDirectory) {
                that.pakDirectory = pakDirectory;
                that.pakDirectory.pakRepositories.forEach(function (pakRepo) {
                    pakRepo.getPakList();
                });
            });
        };
        NewSession = __decorate([
            aurelia_framework_1.inject(state_directory_1.StateDirectory), 
            __metadata('design:paramtypes', [state_directory_1.StateDirectory])
        ], NewSession);
        return NewSession;
    }());
    exports.NewSession = NewSession;
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
define('state/state-repository-chooser',["require", "exports", 'aurelia-framework', 'aurelia-router', '../platform/state/state-directory', '../platform/plotter'], function (require, exports, aurelia_framework_1, aurelia_router_1, state_directory_1, plotter_1) {
    "use strict";
    var StateRepositoryChooser = (function () {
        function StateRepositoryChooser(stateDirectory, router, plotter) {
            var _this = this;
            this.stateDirectory = stateDirectory;
            this.router = router;
            this.plotter = plotter;
            this.choose = function () {
                _this.plotter.stateRepository = _this.state;
                _this.router.navigateToRoute('session', { hostId: _this.state.uniqueId });
            };
            this.states = stateDirectory.stateRepositories;
        }
        StateRepositoryChooser = __decorate([
            aurelia_framework_1.inject(state_directory_1.StateDirectory, aurelia_router_1.Router, plotter_1.Plotter), 
            __metadata('design:paramtypes', [state_directory_1.StateDirectory, aurelia_router_1.Router, plotter_1.Plotter])
        ], StateRepositoryChooser);
        return StateRepositoryChooser;
    }());
    exports.StateRepositoryChooser = StateRepositoryChooser;
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
define('state/state-session-chooser',["require", "exports", 'aurelia-framework', 'aurelia-router', '../platform/state/state-directory', '../platform/plotter'], function (require, exports, aurelia_framework_1, aurelia_router_1, state_directory_1, plotter_1) {
    "use strict";
    var StateSessionChooser = (function () {
        function StateSessionChooser(stateDirectory, plotter, router) {
            this.stateDirectory = stateDirectory;
            this.plotter = plotter;
            this.router = router;
            this.message = 'no message.';
            this.sessionList = [];
        }
        StateSessionChooser.prototype.activate = function (params) {
            var that = this;
            this.stateRepoUniqueId = params.hostId;
            this.stateRepo = this.stateDirectory.getStateRepository(this.stateRepoUniqueId);
            if (this.stateRepo) {
                this.message = 'found repo';
                this.stateRepo.getSessionList()
                    .then(function (sessionList) {
                    that.sessionList = sessionList;
                });
            }
            else {
                this.message = 'did not find repo';
            }
        };
        StateSessionChooser.prototype.choose = function () {
            var that = this;
            if (!this.sessionId) {
                this.router.navigateToRoute('newSession', { hostId: this.stateRepoUniqueId });
                return;
            }
            this.stateDirectory.getStateSession(this.stateRepoUniqueId, this.sessionId)
                .then(function (stateSession) {
                that.plotter.stateSession = stateSession;
                that.router.navigateToRoute('shell', { hostId: that.stateRepoUniqueId, sessionId: that.sessionId });
            });
        };
        StateSessionChooser = __decorate([
            aurelia_framework_1.inject(state_directory_1.StateDirectory, plotter_1.Plotter, aurelia_router_1.Router), 
            __metadata('design:paramtypes', [state_directory_1.StateDirectory, plotter_1.Plotter, aurelia_router_1.Router])
        ], StateSessionChooser);
        return StateSessionChooser;
    }());
    exports.StateSessionChooser = StateSessionChooser;
});



define("platform/pak/pak-provider-service", [],function(){});

define('platform/state/state-repository-github-gist',["require", "exports"], function (require, exports) {
    "use strict";
    var StateRepositoryGitHubGist = (function () {
        function StateRepositoryGitHubGist() {
        }
        return StateRepositoryGitHubGist;
    }());
    exports.StateRepositoryGitHubGist = StateRepositoryGitHubGist;
});



define("platform/state/state-repository-local-storage", [],function(){});

define('platform/state/state-repository-service',["require", "exports"], function (require, exports) {
    "use strict";
    var StateRepositoryService = (function () {
        function StateRepositoryService() {
        }
        return StateRepositoryService;
    }());
    exports.StateRepositoryService = StateRepositoryService;
});

define('../test/unit/app.spec',["require", "exports", '../../src/app', '../../src/platform/platform-startup', '../../src/platform/plotter', 'aurelia-framework', 'aurelia-fetch-client'], function (require, exports, app_1, platform_startup_1, plotter_1, aurelia_framework_1, aurelia_fetch_client_1) {
    "use strict";
    describe('the app', function () {
        it('says hello', function () {
            var httpMock = new aurelia_fetch_client_1.HttpClient();
            httpMock.fetch = function (url) { return Promise.resolve({
                json: function () { return []; },
            }); };
            var plotterConfig = new plotter_1.Plotter();
            var container = new aurelia_framework_1.Container();
            var platformStartup = new platform_startup_1.PlatformStartup(httpMock, plotterConfig);
            expect(new app_1.App(platformStartup, plotterConfig, container).message).toBe('Hello World!');
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

define('../test/unit/platform/platform-startup.spec',["require", "exports", 'aurelia-fetch-client', '../../../src/platform/platform-startup', '../../../src/platform/plotter'], function (require, exports, aurelia_fetch_client_1, platform_startup_1, plotter_1) {
    "use strict";
    describe('platform startup class', function () {
        it('returns a promise of type platform config', function () {
            var plotterConfig = new plotter_1.Plotter();
            var platformStartup = new platform_startup_1.PlatformStartup(new aurelia_fetch_client_1.HttpClient(), plotterConfig);
            var ret = platformStartup.start();
            expect(ret instanceof Promise).toBe(true);
        });
        it('resolves the promise', (function (done) {
            var plotterConfig = new plotter_1.Plotter();
            var httpClient = new aurelia_fetch_client_1.HttpClient();
            httpClient.baseUrl = 'http://localhost:9000/';
            var platformStartup = new platform_startup_1.PlatformStartup(httpClient, plotterConfig);
            platformStartup.start()
                .then(function (stateDirectory) {
                expect(stateDirectory.stateRepositories.length).toBe(2);
                done();
            })
                .catch(function (reason) {
                expect(true).toBe(false);
                alert("start failed: " + reason);
                done();
            });
        }));
        it('true is true', function () {
            expect(true).toBe(true);
        });
    });
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"app.css\"></require>\n  <router-view></router-view>\n</template>\n"; });
define('text!app.css', ['module'], function(module) { module.exports = "router-view {\n  flex: 1 0;\n  display: flex;\n  flex-direction: column;\n}\n"; });
define('text!shell/shell.css', ['module'], function(module) { module.exports = ".header {\n  background-color: mediumaquamarine;\n  padding: 10px;\n}\n.body {\n  flex: 1 1;\n  padding: 10px;\n  background-color: darkcyan;\n}\n"; });
define('text!shell/shell.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./shell.css\"></require>\r\n    <div class=\"header\">\r\n        <h1>Shell (${hostId} / ${sessionId}) </h1>\r\n    </div>\r\n    <div class=\"body\">\r\n        <h1>Active Paks</h1>\r\n        <div repeat.for=\"activePak of session.activePaks\">\r\n            <h3>${activePak.uniqueId}: [${activePak.pakHostId} / ${activePak.pakId}]</h3>\r\n            <ul if.bind=\"activePak.pak\">\r\n                <li repeat.for=\"vi of activePak.viewInstances\">(${vi.paneType}) ${vi.uniqueId}: ${vi.viewId}</li>\r\n            </ul>\r\n            <p if.bind=\"!activePak.pak\">loading...</p>\r\n        </div>\r\n\r\n        <h1>Panes</h1>\r\n        <h3>Nav</h3>\r\n        <ul if.bind=\"navViewInstances.length\">\r\n            <li repeat.for=\"vi of navViewInstances\">(${vi.paneType}) ${vi.uniqueId}: ${vi.viewId}</li>\r\n        </ul>\r\n\r\n        <h3>Main</h3>\r\n        <ul if.bind=\"navViewInstances.length\">\r\n            <li repeat.for=\"vi of mainViewInstances\">(${vi.paneType}) ${vi.uniqueId}: ${vi.viewId}</li>\r\n        </ul>\r\n\r\n        <h3>Alt</h3>\r\n        <ul if.bind=\"navViewInstances.length\">\r\n            <li repeat.for=\"vi of altViewInstances\">(${vi.paneType}) ${vi.uniqueId}: ${vi.viewId}</li>\r\n        </ul>\r\n    </div>\r\n</template>"; });
define('text!shell/state-repository-chooser.css', ['module'], function(module) { module.exports = ".header {\n  background-color: mediumaquamarine;\n  padding: 10px;\n}\n.body {\n  flex: 1 1;\n  padding: 10px;\n  background-color: darkcyan;\n}\n"; });
define('text!state/new-session.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./new-session.css\"></require>\r\n    <div class=\"header\">\r\n        <h1>New Session on ${hostId}</h1>\r\n    </div>\r\n    <div class=\"body\">\r\n        <div repeat.for=\"pakRepo of pakDirectory.pakRepositories\">\r\n            <h3>${pakRepo.uniqueId}</h3>\r\n            <p repeat.for=\"pakId of pakRepo.pakList\">&nbsp;&nbsp;&nbsp;&nbsp;<label><input type=\"checkbox\" value.bind=\"pakId\"> ${pakId}</label></p>\r\n        </div>\r\n    </div>\r\n</template>"; });
define('text!state/new-session.css', ['module'], function(module) { module.exports = ".header {\n  background-color: mediumaquamarine;\n  padding: 10px;\n}\n.body {\n  flex: 1 1;\n  padding: 10px;\n  background-color: darkcyan;\n}\n"; });
define('text!state/state-repository-chooser.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./state-repository-chooser.css\"></require>\r\n    <div class=\"header\">\r\n        <h1>Plotter Host</h1>\r\n        <h3>Choose Plotter Host:</h3>\r\n        <div class=\"input-group input-group-lg\">\r\n            <select class=\"form-control\" value.bind=\"state\">\r\n                <option model.bind=\"ss\" repeat.for=\"ss of states\">${ss.uniqueId}</option>\r\n            </select>\r\n            <span class=\"input-group-addon\" click.trigger=\"choose()\">\r\n                <i class=\"fa fa-arrow-circle-right fa-lg\"></i>\r\n            </span>\r\n        </div>\r\n    </div>\r\n    <div class=\"body\"></div>\r\n</template>"; });
define('text!state/state-repository-chooser.css', ['module'], function(module) { module.exports = ".header {\n  background-color: mediumaquamarine;\n  padding: 10px;\n}\n.body {\n  flex: 1 1;\n  padding: 10px;\n  background-color: darkcyan;\n}\n"; });
define('text!state/state-session-chooser.css', ['module'], function(module) { module.exports = ".header {\n  background-color: mediumaquamarine;\n  padding: 10px;\n}\n.body {\n  flex: 1 1;\n  padding: 10px;\n  background-color: darkcyan;\n}\n"; });
define('text!state/state-session-chooser.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./state-repository-chooser.css\"></require>\r\n    <div class=\"header\">\r\n        <h1>Session Chooser (${stateRepoUniqueId}) </h1>\r\n        <p>${message} </p>\r\n        <h3>Choose Session:</h3>\r\n        <div class=\"input-group input-group-lg\">\r\n            <select class=\"form-control\" value.bind=\"sessionId\">\r\n                <option value.bind=\"''\">(New Session)</option>\r\n                <option value.bind=\"s\" repeat.for=\"s of sessionList\">${s}</option>\r\n            </select>\r\n            <span class=\"input-group-addon\" click.trigger=\"choose()\">\r\n                <i class=\"fa fa-arrow-circle-right fa-lg\"></i>\r\n            </span>\r\n        </div>\r\n\r\n    </div>\r\n    <div class=\"body\"></div>\r\n</template>\r\n"; });
//# sourceMappingURL=app-bundle.js.map