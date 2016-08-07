# PhoneGap Notes

## [PhoneGap CLI Docs](http://docs.phonegap.com/references/phonegap-cli/)

> The PhoneGap CLI provides a command line interface for creating PhoneGap apps as 
> * an alternative to using the PhoneGap Desktop application. 
> * The PhoneGap CLI was the main tool used for creating PhoneGap apps prior to PhoneGap Desktop and 
> * contains additional features over the PhoneGap Desktop 
> * for building, running and packaging PhoneGap applications for multiple platforms.

### Install PhoneGap CLI

```bash
npm install -g phonegap
```

### Create Project

```bash
phonegap create . --id "com.technicalmedia.plotterplatform" --name "PlotterPlatform"
```

### Run Project in Browser

```bash
phonegap serve
```

### [Update Config](http://docs.phonegap.com/phonegap-build/configuring/)

> PhoneGap and PhoneGap Build are built upon the Apache Cordova Project. 
> * See [docs.cordova.io](http://docs.cordova.io) - how PhoneGap and Cordova applications are configured.
> * PhoneGap applications are configured using a config.xml file at the root of your application

### File System - Get local config files

```javascript
let pathToFile = `${cordova.file.dataDirectory}phonegapdevapp/www/${fileName}`;
```

### [Android Signing](http://docs.phonegap.com/phonegap-build/signing/android/)


### Deploy to PhoneGap Build

1. zip the folder
2. upload the folder to phonegap build

### Links

> * [phonegap-cli-url](http://github.com/phonegap/phonegap-cli)
> * [cordova-app](http://github.com/apache/cordova-app-hello-world)
> * [bithound-img](https://www.bithound.io/github/phonegap/phonegap-app-hello-world/badges/score.svg)
> * [bithound-url](https://www.bithound.io/github/phonegap/phonegap-app-hello-world)
> * [config-xml](https://github.com/phonegap/phonegap-template-hello-world/blob/master/config.xml)
> * [index-html](https://github.com/phonegap/phonegap-template-hello-world/blob/master/www/index.html)
> * [cordova-whitelist-guide](https://cordova.apache.org/docs/en/dev/guide/appdev/whitelist/index.html)
> * [cordova-plugin-whitelist](http://cordova.apache.org/docs/en/latest/reference/cordova-plugin-whitelist)
> * [cordova-plugin-whitelist-csp](http://cordova.apache.org/docs/en/latest/reference/cordova-plugin-whitelist#content-security-policy)
> * [csp-is-awesome](http://cspisawesome.com)

## [PhoneGap Build](http://docs.phonegap.com/phonegap-build/)

> [PhoneGap Build](https://build.phonegap.com/) is a cloud service for compiling PhoneGap applications

###