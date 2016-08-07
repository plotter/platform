export class ElectronHelper {
    public get isElectron()  {
        return this.fs && window.location
            && window.location.toString().startsWith('file:');
    };

    get fs() {
        return (<any> window).nodeReq && (<any> window).nodeReq('fs');
    }

    get app() {
        return (<any> window).nodeReq && (<any> window).nodeReq('app');
    }

    get process() {
        return (<any> window).nodeReq && (<any> window).nodeReq('process');
    }

    public get userDataPath() {
        return (<any> window).__dirname;
    }
}
