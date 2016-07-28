export class ElectronHelper {
    public get isElectron()  {
        return window.location && window.location.toString().startsWith('file:');
    };

    get fs() {
        return (<any> window).nodeReq && (<any> window).nodeReq('fs');
    }
}
