requirejs.config({
    "baseUrl": "src/",
    "paths": {
        "text": "../scripts/text",
        "aurelia-bootstrapper": "../node_modules\\aurelia-bootstrapper\\dist\\amd\\aurelia-bootstrapper",
        "aurelia-event-aggregator": "../node_modules\\aurelia-event-aggregator\\dist\\amd\\aurelia-event-aggregator",
        "aurelia-dependency-injection": "../node_modules\\aurelia-dependency-injection\\dist\\amd\\aurelia-dependency-injection",
        "aurelia-fetch-client": "../node_modules\\aurelia-fetch-client\\dist\\amd\\aurelia-fetch-client",
        "aurelia-history": "../node_modules\\aurelia-history\\dist\\amd\\aurelia-history",
        "aurelia-binding": "../node_modules\\aurelia-binding\\dist\\amd\\aurelia-binding",
        "aurelia-loader-default": "../node_modules\\aurelia-loader-default\\dist\\amd\\aurelia-loader-default",
        "aurelia-framework": "../node_modules\\aurelia-framework\\dist\\amd\\aurelia-framework",
        "aurelia-loader": "../node_modules\\aurelia-loader\\dist\\amd\\aurelia-loader",
        "aurelia-history-browser": "../node_modules\\aurelia-history-browser\\dist\\amd\\aurelia-history-browser",
        "aurelia-logging-console": "../node_modules\\aurelia-logging-console\\dist\\amd\\aurelia-logging-console",
        "aurelia-logging": "../node_modules\\aurelia-logging\\dist\\amd\\aurelia-logging",
        "aurelia-metadata": "../node_modules\\aurelia-metadata\\dist\\amd\\aurelia-metadata",
        "aurelia-pal": "../node_modules\\aurelia-pal\\dist\\amd\\aurelia-pal",
        "aurelia-path": "../node_modules\\aurelia-path\\dist\\amd\\aurelia-path",
        "aurelia-polyfills": "../node_modules\\aurelia-polyfills\\dist\\amd\\aurelia-polyfills",
        "aurelia-route-recognizer": "../node_modules\\aurelia-route-recognizer\\dist\\amd\\aurelia-route-recognizer",
        "aurelia-pal-browser": "../node_modules\\aurelia-pal-browser\\dist\\amd\\aurelia-pal-browser",
        "aurelia-router": "../node_modules\\aurelia-router\\dist\\amd\\aurelia-router",
        "aurelia-task-queue": "../node_modules\\aurelia-task-queue\\dist\\amd\\aurelia-task-queue",
        "aurelia-templating": "../node_modules\\aurelia-templating\\dist\\amd\\aurelia-templating",
        "aurelia-templating-binding": "../node_modules\\aurelia-templating-binding\\dist\\amd\\aurelia-templating-binding",
        "app-bundle": "../scripts/app-bundle"
    },
    "packages": [
        {
            "name": "aurelia-templating-resources",
            "location": "../node_modules/aurelia-templating-resources/dist/amd",
            "main": "aurelia-templating-resources"
        },
        {
            "name": "aurelia-testing",
            "location": "../node_modules/aurelia-testing/dist/amd",
            "main": "aurelia-testing"
        },
        {
            "name": "aurelia-templating-router",
            "location": "../node_modules/aurelia-templating-router/dist/amd",
            "main": "aurelia-templating-router"
        }
    ],
    "stubModules": [],
    "shim": {},
    "bundles": {
        "app-bundle": [
            "platform/pak/view",
            "platform/pak/pak",
            "platform/pak/pak-repository",
            "platform/electron-helper",
            "platform/phone-gap-helper",
            "platform/pak/pak-repository-file",
            "platform/pak/pak-directory",
            "platform/state/view-instance",
            "platform/state/active-pak",
            "platform/state/state-session",
            "platform/state/state-repository",
            "platform/state/state-repository-file",
            "platform/state/state-directory",
            "platform/plotter",
            "platform/platform-startup",
            "app",
            "environment",
            "main",
            "resources/index",
            "shell/shell",
            "shell/view-instance-toolbar",
            "state/new-session",
            "state/state-repository-chooser",
            "state/state-session-chooser",
            "platform/pak/pak-provider-service",
            "platform/state/state-repository-github-gist",
            "platform/state/state-repository-local-storage",
            "platform/state/state-repository-service",
            "views/one/one",
            "views/globe/globe",
            "views/three/three",
            "views/two/two",
            "../test/unit/app.spec",
            "../test/unit/setup",
            "../test/unit/platform/platform-startup.spec",
            "shell/state-repository-chooser"
        ]
    }
});