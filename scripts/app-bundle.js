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

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('platform/pak/pak-repository-file',["require", "exports", 'aurelia-framework', 'aurelia-fetch-client', './pak', '../electron-helper'], function (require, exports, aurelia_framework_1, aurelia_fetch_client_1, pak_1, electron_helper_1) {
    "use strict";
    var PakRepositoryFile = (function () {
        function PakRepositoryFile(httpClient, electronHelper) {
            var _this = this;
            this.httpClient = httpClient;
            this.electronHelper = electronHelper;
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
                    if (that.electronHelper.isElectron) {
                        var fs = that.electronHelper.fs;
                        fs.readFile(that.path + "/" + that.uniqueId + "/" + pakId + ".json", function (reason, stringData) {
                            if (reason) {
                                reject(new Error("fetch pak failed: reason: \r\n\r\n" + reason));
                                return;
                            }
                            var data = JSON.parse(stringData);
                            var pak = pak_1.Pak.fromJSON(data);
                            pak.pakRepository = that;
                            that.pakMap.set(pakId, pak);
                            resolve(pak);
                            return;
                        });
                    }
                    else {
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
                            reject(new Error("fetch pak failed: reason: \r\n\r\n" + reason));
                        });
                    }
                });
                _this.pakPromiseMap.set(pakId, pakPromise);
                return pakPromise;
            };
            this.getPakList = function () {
                var that = _this;
                return new Promise(function (resolve, reject) {
                    if (that.electronHelper.isElectron) {
                        var fs = that.electronHelper.fs;
                        fs.readFile(that.path + "/" + that.uniqueId + "/pak-list.json", function (reason, stringData) {
                            if (reason) {
                                reject(new Error("fetch pak list failed: reason: \r\n\r\n" + reason));
                                return;
                            }
                            var data = JSON.parse(stringData);
                            that.pakList = data.pakList;
                            resolve(data.pakList);
                            return;
                        });
                    }
                    else {
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
                    }
                });
            };
        }
        PakRepositoryFile = __decorate([
            aurelia_framework_1.inject(aurelia_fetch_client_1.HttpClient, electron_helper_1.ElectronHelper), 
            __metadata('design:paramtypes', [aurelia_fetch_client_1.HttpClient, electron_helper_1.ElectronHelper])
        ], PakRepositoryFile);
        return PakRepositoryFile;
    }());
    exports.PakRepositoryFile = PakRepositoryFile;
});

define('platform/pak/pak-directory',["require", "exports", 'aurelia-fetch-client', './pak-repository-file', '../electron-helper'], function (require, exports, aurelia_fetch_client_1, pak_repository_file_1, electron_helper_1) {
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
                            var pakRepository = new pak_repository_file_1.PakRepositoryFile(new aurelia_fetch_client_1.HttpClient(), new electron_helper_1.ElectronHelper());
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
            if (!json.title) {
                viewInstance.title = json.uniqueId;
            }
            else {
                viewInstance.title = json.title;
            }
            viewInstance.viewId = json.viewId;
            viewInstance.viewTemplate = json.viewTemplate;
            viewInstance.viewModel = json.viewModel;
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
                        that.view = view;
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
define('platform/state/state-repository-file',["require", "exports", 'aurelia-framework', 'aurelia-fetch-client', '../pak/pak-directory', './state-session', '../electron-helper'], function (require, exports, aurelia_framework_1, aurelia_fetch_client_1, pak_directory_1, state_session_1, electron_helper_1) {
    "use strict";
    var StateRepositoryFile = (function () {
        function StateRepositoryFile(httpClient, electronHelper) {
            var _this = this;
            this.httpClient = httpClient;
            this.electronHelper = electronHelper;
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
                    if (that.electronHelper.isElectron) {
                        var fs = that.electronHelper.fs;
                        fs.readFile(that.path + "/" + that.uniqueId + "/pak-directory.json", function (reason, stringData) {
                            if (reason) {
                                reject(new Error("fetch pak-directory failed: reason: \r\n\r\n" + reason));
                                return;
                            }
                            var data = JSON.parse(stringData);
                            var pakDirectory = pak_directory_1.PakDirectory.fromJSON(data);
                            pakDirectory.stateRepository = that;
                            resolve(pakDirectory);
                            return;
                        });
                    }
                    else {
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
                    }
                });
            };
        }
        StateRepositoryFile.fromJSON = function (json) {
            var stateRepository = new StateRepositoryFile(new aurelia_fetch_client_1.HttpClient(), new electron_helper_1.ElectronHelper());
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
                if (that.electronHelper.isElectron) {
                    var fs = that.electronHelper.fs;
                    fs.readFile(that.path + "/" + that.uniqueId + "/" + sessionId + ".json", function (reason, stringData) {
                        if (reason) {
                            reject(new Error("fetch session list: reason: \r\n\r\n" + reason));
                            return;
                        }
                        var data = JSON.parse(stringData);
                        var stateSession = state_session_1.StateSession.fromJSON(data);
                        stateSession.stateRepository = that;
                        that.stateSessionMap.set(sessionId, stateSession);
                        resolve(stateSession);
                        return;
                    });
                }
                else {
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
                }
            });
            this.stateSessionPromiseMap.set(sessionId, stateSessionPromise);
            return stateSessionPromise;
        };
        StateRepositoryFile.prototype.getSessionList = function () {
            var that = this;
            alert("path: " + this.path);
            return new Promise(function (resolve, reject) {
                if (that.electronHelper.isElectron) {
                    var fs = that.electronHelper.fs;
                    fs.readFile(that.path + "/" + that.uniqueId + "/session-list.json", function (reason, stringData) {
                        if (reason) {
                            reject(new Error("fetch session list: reason: \r\n\r\n" + reason));
                            return;
                        }
                        var data = JSON.parse(stringData);
                        resolve(data.sessionList);
                        return;
                    });
                }
                else {
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
                }
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
            aurelia_framework_1.inject(aurelia_fetch_client_1.HttpClient, electron_helper_1.ElectronHelper), 
            __metadata('design:paramtypes', [aurelia_fetch_client_1.HttpClient, electron_helper_1.ElectronHelper])
        ], StateRepositoryFile);
        return StateRepositoryFile;
    }());
    exports.StateRepositoryFile = StateRepositoryFile;
});

define('platform/state/state-directory',["require", "exports", 'aurelia-fetch-client', './state-repository-file', '../electron-helper'], function (require, exports, aurelia_fetch_client_1, state_repository_file_1, electron_helper_1) {
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
                            var stateRepository = new state_repository_file_1.StateRepositoryFile(new aurelia_fetch_client_1.HttpClient(), new electron_helper_1.ElectronHelper());
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
define('platform/platform-startup',["require", "exports", 'aurelia-framework', 'aurelia-fetch-client', './state/state-directory', './plotter', './electron-helper'], function (require, exports, aurelia_framework_1, aurelia_fetch_client_1, state_directory_1, plotter_1, electron_helper_1) {
    "use strict";
    var PlatformStartup = (function () {
        function PlatformStartup(httpClient, plotter, electronHelper) {
            this.httpClient = httpClient;
            this.plotter = plotter;
            this.electronHelper = electronHelper;
        }
        PlatformStartup.prototype.start = function () {
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
                    if (that.electronHelper.isElectron) {
                        var fs = that.electronHelper.fs;
                        fs.readFile(sdn + ".json", function (err, stringData) {
                            if (err) {
                                reject(err);
                                return;
                            }
                            var data = JSON.parse(stringData);
                            var stateDirectory = state_directory_1.StateDirectory.fromJSON(data);
                            that.plotter.stateDirectory = stateDirectory;
                            resolve(stateDirectory);
                            return;
                        });
                    }
                    else {
                        that.httpClient.fetch(sdn + ".json")
                            .then(function (response) {
                            return response.json();
                        })
                            .then(function (data) {
                            var stateDirectory = state_directory_1.StateDirectory.fromJSON(data);
                            that.plotter.stateDirectory = stateDirectory;
                            resolve(stateDirectory);
                        })
                            .catch(function (reason) {
                            reject(new Error("fetch state-dictionary2: reason: \r\n\r\n" + reason));
                        });
                    }
                }
            });
        };
        PlatformStartup = __decorate([
            aurelia_framework_1.inject(aurelia_fetch_client_1.HttpClient, plotter_1.Plotter, electron_helper_1.ElectronHelper), 
            __metadata('design:paramtypes', [aurelia_fetch_client_1.HttpClient, plotter_1.Plotter, electron_helper_1.ElectronHelper])
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
define('shell/shell',["require", "exports", 'aurelia-framework', '../platform/state/state-directory', '../platform/state/view-instance'], function (require, exports, aurelia_framework_1, state_directory_1, view_instance_1) {
    "use strict";
    var Shell = (function () {
        function Shell(stateDirectory) {
            var _this = this;
            this.stateDirectory = stateDirectory;
            this.navViewInstances = new Array();
            this.mainViewInstances = new Array();
            this.altViewInstances = new Array();
            this.focusViewInstance = function (viewInstance) {
                switch (viewInstance.paneType) {
                    case 'nav':
                        _this.navActiveViewInstance = viewInstance;
                        break;
                    case 'main':
                        _this.mainActiveViewInstance = viewInstance;
                        break;
                    case 'alt':
                        _this.altActiveViewInstance = viewInstance;
                        break;
                    default:
                        break;
                }
            };
            this.launchViewInstance = function (viewInstance) {
                switch (viewInstance.paneType) {
                    case 'nav':
                        _this.navViewInstances.push(viewInstance);
                        if (!_this.navActiveViewInstance) {
                            _this.navActiveViewInstance = viewInstance;
                        }
                        break;
                    case 'main':
                        _this.mainViewInstances.push(viewInstance);
                        if (!_this.mainActiveViewInstance) {
                            _this.mainActiveViewInstance = viewInstance;
                        }
                        break;
                    case 'alt':
                        _this.altViewInstances.push(viewInstance);
                        if (!_this.altActiveViewInstance) {
                            _this.altActiveViewInstance = viewInstance;
                        }
                        break;
                    default:
                        break;
                }
            };
        }
        Shell.prototype.launchViewInstanceJSON = function (viewInstanceJSON) {
            var newViewInstance = view_instance_1.ViewInstance.fromJSON(viewInstanceJSON);
            this.launchViewInstance(newViewInstance);
            this.focusViewInstance(newViewInstance);
        };
        Shell.prototype.activate = function (params) {
            var that = this;
            this.hostId = params.hostId;
            this.sessionId = params.sessionId;
            this.stateDirectory.getStateSession(this.hostId, this.sessionId)
                .then(function (session) {
                that.session = session;
                that.session.activePaks.forEach(function (activePak) {
                    activePak.viewInstances.forEach(function (viewInstance) {
                        that.launchViewInstance(viewInstance);
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
define('shell/view-instance-toolbar',["require", "exports", 'aurelia-framework', '../platform/state/view-instance'], function (require, exports, aurelia_framework_1, view_instance_1) {
    "use strict";
    var ViewInstanceToolbar = (function () {
        function ViewInstanceToolbar() {
            var _this = this;
            this.removeItem = function (vi, index, viArr) {
                viArr.splice(index, 1);
                if (_this.activeViewInstance === vi && viArr.length > 0) {
                    _this.activeViewInstance = viArr[0];
                }
            };
        }
        __decorate([
            aurelia_framework_1.bindable(), 
            __metadata('design:type', view_instance_1.ViewInstance)
        ], ViewInstanceToolbar.prototype, "activeViewInstance", void 0);
        __decorate([
            aurelia_framework_1.bindable(), 
            __metadata('design:type', Array)
        ], ViewInstanceToolbar.prototype, "viewInstances", void 0);
        __decorate([
            aurelia_framework_1.bindable(), 
            __metadata('design:type', Boolean)
        ], ViewInstanceToolbar.prototype, "showTitle", void 0);
        ViewInstanceToolbar = __decorate([
            aurelia_framework_1.customElement('view-instance-toolbar'), 
            __metadata('design:paramtypes', [])
        ], ViewInstanceToolbar);
        return ViewInstanceToolbar;
    }());
    exports.ViewInstanceToolbar = ViewInstanceToolbar;
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

define('views/globe/globe',["require", "exports"], function (require, exports) {
    "use strict";
    var Globe = (function () {
        function Globe() {
        }
        return Globe;
    }());
    exports.Globe = Globe;
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
define('views/one/one',["require", "exports", 'aurelia-framework', '../../shell/shell'], function (require, exports, aurelia_framework_1, shell_1) {
    "use strict";
    var One = (function () {
        function One(shell) {
            this.shell = shell;
            this.targetPane = 'main';
            this.targetMessage = 'some message from you...';
            this.targetViewModel = '../views/one/one';
        }
        One.prototype.activate = function (model) {
            this.model = model;
        };
        One.prototype.launchTarget = function () {
            this.shell.launchViewInstanceJSON({
                'uniqueId': 'vi-05',
                'viewId': 'view3',
                'paneType': this.targetPane,
                'viewTemplate': null,
                'viewModel': this.targetViewModel,
                'viewState': {
                    'a': this.targetMessage,
                },
            });
        };
        One = __decorate([
            aurelia_framework_1.inject(shell_1.Shell), 
            __metadata('design:paramtypes', [shell_1.Shell])
        ], One);
        return One;
    }());
    exports.One = One;
});

define('views/three/three',["require", "exports"], function (require, exports) {
    "use strict";
    var Three = (function () {
        function Three() {
        }
        return Three;
    }());
    exports.Three = Three;
});

define('views/two/two',["require", "exports"], function (require, exports) {
    "use strict";
    var Two = (function () {
        function Two() {
        }
        return Two;
    }());
    exports.Two = Two;
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

define('platform/electron-helper',["require", "exports"], function (require, exports) {
    "use strict";
    var ElectronHelper = (function () {
        function ElectronHelper() {
        }
        Object.defineProperty(ElectronHelper.prototype, "isElectron", {
            get: function () {
                return window.location && window.location.toString().startsWith('file:');
            },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(ElectronHelper.prototype, "fs", {
            get: function () {
                return window.nodeReq && window.nodeReq('fs');
            },
            enumerable: true,
            configurable: true
        });
        return ElectronHelper;
    }());
    exports.ElectronHelper = ElectronHelper;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"app.css\"></require>\n  <router-view></router-view>\n</template>\n"; });
define('text!shell/shell.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./shell.css\"></require>\r\n    <require from=\"./view-instance-toolbar\"></require>\r\n\r\n    <div class=\"header\">\r\n        <h1>Shell (${hostId} / ${sessionId}) </h1>\r\n    </div>\r\n\r\n    <div class=\"body\">\r\n        <div class=\"nav\" if.bind=\"navViewInstances.length\">\r\n            <div class=\"nav-body\">\r\n                <div class=\"nav-host\">\r\n                    <compose\r\n                        repeat.for=\"vi of navViewInstances\"\r\n                        view.bind=\"vi.viewTemplate\"\r\n                        view-model.bind=\"vi.viewModel\"\r\n                        model.bind=\"vi.viewState\"\r\n                        show.bind=\"vi === $parent.navActiveViewInstance\">\r\n                    </compose>\r\n                </div>\r\n            </div>\r\n            <div class=\"nav-toolbar\" if.bind=\"navViewInstances.length > 1\">\r\n                <view-instance-toolbar\r\n                    view-instances.bind=\"navViewInstances\"\r\n                    active-view-instance.two-way=\"navActiveViewInstance\">\r\n                </view-instance-toolbar>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"body2\">\r\n\r\n            <div class=\"main\" if.bind=\"mainViewInstances.length\">\r\n                <div class=\"main-toolbar\" if.bind=\"mainViewInstances.length > 1\">\r\n                    <view-instance-toolbar\r\n                        view-instances.bind=\"mainViewInstances\"\r\n                        active-view-instance.two-way=\"mainActiveViewInstance\"\r\n                        show-title=\"true\">\r\n                    </view-instance-toolbar>\r\n                </div>\r\n                <div class=\"main-body\">\r\n                    <div class=\"main-host\">\r\n                        <compose\r\n                            repeat.for=\"vi of mainViewInstances\"\r\n                            view.bind=\"vi.viewTemplate\"\r\n                            view-model.bind=\"vi.viewModel\"\r\n                            model.bind=\"vi.viewState\"\r\n                            show.bind=\"vi === $parent.mainActiveViewInstance\">\r\n                        </compose>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"alt\" if.bind=\"altViewInstances.length\">\r\n                <div class=\"alt-toolbar\" if.bind=\"altViewInstances.length > 1\">\r\n                    <view-instance-toolbar\r\n                        view-instances.bind=\"altViewInstances\"\r\n                        active-view-instance.two-way=\"altActiveViewInstance\"\r\n                        show-title=\"true\">\r\n                    </view-instance-toolbar>\r\n                </div>\r\n                <div class=\"alt-body\">\r\n                    <div class=\"alt-host\">\r\n                        <compose\r\n                            repeat.for=\"vi of altViewInstances\"\r\n                            view.bind=\"vi.viewTemplate\"\r\n                            view-model.bind=\"vi.viewModel\"\r\n                            model.bind=\"vi.viewState\"\r\n                            show.bind=\"vi === $parent.altActiveViewInstance\">\r\n                        </compose>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n        </div>\r\n    </div>\r\n</template>"; });
define('text!app.css', ['module'], function(module) { module.exports = "router-view {\n  flex: 1 0;\n  display: flex;\n  flex-direction: column;\n}\n"; });
define('text!shell/view-instance-toolbar.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./view-instance-toolbar.css\"></require>\r\n\r\n    <div class=\"btn-group\" data-toggle=\"buttons\">\r\n        <label repeat.for=\"vi of viewInstances\" class=\"btn btn-primary ${vi === $parent.activeViewInstance ? 'active' : ''}\">\r\n            <input type=\"radio\" name=\"vi\" model.bind=\"vi\" checked.bind=\"$parent.activeViewInstance\">\r\n            <i class=\"fa fa-plug\"></i>\r\n            <span if.bind=\"$parent.showTitle\">${vi.title}</span>\r\n            <i class=\"fa fa-times\" click.trigger=\"removeItem(vi, $index, $parent.viewInstances)\"></i>\r\n        </label>\r\n    </div>\r\n\r\n</template>\r\n"; });
define('text!shell/shell.css', ['module'], function(module) { module.exports = ".header {\n  background-color: mediumaquamarine;\n}\n.body {\n  display: flex;\n  flex-direction: row;\n  flex: 1 0;\n}\n.nav {\n  display: flex;\n  flex-direction: column;\n  background-color: lightseagreen;\n  width: 200px;\n}\n.nav-body {\n  margin: 0;\n  padding: 0;\n  flex: 1 0;\n  position: relative;\n  overflow: hidden;\n}\n.nav-toolbar {\n  background-color: cadetblue;\n}\n.nav-host {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  margin: 0;\n  padding: 0;\n  overflow: auto;\n}\n.body2 {\n  display: flex;\n  flex-direction: column;\n  flex: 1 0;\n}\n.main {\n  display: flex;\n  flex-direction: column;\n  flex: 2 0;\n  background-color: aquamarine;\n}\n.main-toolbar {\n  background-color: cadetblue;\n}\n.main-body {\n  position: relative;\n  overflow: hidden;\n  margin: 0;\n  padding: 0;\n  flex: 1 0;\n}\n.main-host {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  overflow: auto;\n}\n.alt {\n  display: flex;\n  flex-direction: column;\n  flex: 1 0;\n  background-color: darkcyan;\n}\n.alt-toolbar {\n  background-color: cadetblue;\n}\n.alt-body {\n  position: relative;\n  overflow: hidden;\n  margin: 0;\n  padding: 0;\n  flex: 1 0;\n}\n.alt-host {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  overflow: auto;\n}\n"; });
define('text!state/new-session.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./new-session.css\"></require>\r\n    <div class=\"header\">\r\n        <h1>New Session on ${hostId}</h1>\r\n    </div>\r\n    <div class=\"body\">\r\n        <div repeat.for=\"pakRepo of pakDirectory.pakRepositories\">\r\n            <h3>${pakRepo.uniqueId}</h3>\r\n            <p repeat.for=\"pakId of pakRepo.pakList\">&nbsp;&nbsp;&nbsp;&nbsp;<label><input type=\"checkbox\" value.bind=\"pakId\"> ${pakId}</label></p>\r\n        </div>\r\n    </div>\r\n</template>"; });
define('text!shell/state-repository-chooser.css', ['module'], function(module) { module.exports = ".header {\n  background-color: mediumaquamarine;\n  padding: 10px;\n}\n.body {\n  flex: 1 1;\n  padding: 10px;\n  background-color: darkcyan;\n}\n"; });
define('text!shell/view-instance-toolbar.css', ['module'], function(module) { module.exports = ""; });
define('text!state/state-repository-chooser.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./state-repository-chooser.css\"></require>\r\n    <div class=\"header\">\r\n        <h1>Plotter Host</h1>\r\n        <h3>Choose Plotter Host:</h3>\r\n        <div class=\"input-group input-group-lg\">\r\n            <select class=\"form-control\" value.bind=\"state\">\r\n                <option model.bind=\"ss\" repeat.for=\"ss of states\">${ss.uniqueId}</option>\r\n            </select>\r\n            <span class=\"input-group-addon\" click.trigger=\"choose()\">\r\n                <i class=\"fa fa-arrow-circle-right fa-lg\"></i>\r\n            </span>\r\n        </div>\r\n    </div>\r\n    <div class=\"body\"></div>\r\n</template>"; });
define('text!state/new-session.css', ['module'], function(module) { module.exports = ".header {\n  background-color: mediumaquamarine;\n  padding: 10px;\n}\n.body {\n  flex: 1 1;\n  padding: 10px;\n  background-color: darkcyan;\n}\n"; });
define('text!state/state-session-chooser.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./state-repository-chooser.css\"></require>\r\n    <div class=\"header\">\r\n        <h1>Session Chooser (${stateRepoUniqueId}) </h1>\r\n        <p>${message} </p>\r\n        <h3>Choose Session:</h3>\r\n        <div class=\"input-group input-group-lg\">\r\n            <select class=\"form-control\" value.bind=\"sessionId\">\r\n                <option value.bind=\"''\">(New Session)</option>\r\n                <option value.bind=\"s\" repeat.for=\"s of sessionList\">${s}</option>\r\n            </select>\r\n            <span class=\"input-group-addon\" click.trigger=\"choose()\">\r\n                <i class=\"fa fa-arrow-circle-right fa-lg\"></i>\r\n            </span>\r\n        </div>\r\n\r\n    </div>\r\n    <div class=\"body\"></div>\r\n</template>\r\n"; });
define('text!views/globe/globe.html', ['module'], function(module) { module.exports = "<template>\r\n    <h1>Globe</h1>\r\n</template>\r\n"; });
define('text!state/state-repository-chooser.css', ['module'], function(module) { module.exports = ".header {\n  background-color: mediumaquamarine;\n  padding: 10px;\n}\n.body {\n  flex: 1 1;\n  padding: 10px;\n  background-color: darkcyan;\n}\n"; });
define('text!views/one/one.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./one.css\"></require>\r\n    <h1>One (local)</h1>\r\n    <p class=\"wide\">${model.a}</p>\r\n    <select value.bind=\"targetPane\">\r\n        <option repeat.for=\"p of ['nav', 'main', 'alt']\" value.bind=\"p\">${p}</option>\r\n    </select>\r\n    <input type=\"text\" value.bind=\"targetViewModel\" />\r\n    <input type=\"text\" value.bind=\"targetMessage\" />\r\n    <button click.trigger=\"launchTarget()\">Launch</button>\r\n</template>"; });
define('text!state/state-session-chooser.css', ['module'], function(module) { module.exports = ".header {\n  background-color: mediumaquamarine;\n  padding: 10px;\n}\n.body {\n  flex: 1 1;\n  padding: 10px;\n  background-color: darkcyan;\n}\n"; });
define('text!views/one/one.css', ['module'], function(module) { module.exports = ""; });
define('text!views/three/three.html', ['module'], function(module) { module.exports = "<template>\r\n    <h1>three</h1>\r\n</template>"; });
define('text!views/two/two.html', ['module'], function(module) { module.exports = "<template>\r\n    <h1>two</h1>\r\n</template>"; });
//# sourceMappingURL=app-bundle.js.map