export class PhoneGapHelper {

    public get baseUrl() {

        // only set it the first time
        (<any>window).plotterRootPath = (<any>window).plotterRootPath
            || window.location.toString().replace('index.html', '');
        return (<any>window).plotterRootPath;
    }

    public get isPhoneGap() {
        return (<any>window).cordova && window.location
            && window.location.toString().startsWith('file:');
    };

    public readFromFile = (fileName: string): Promise<Object> => {
        let that = this;

        return new Promise<Object>((resolve, reject) => {
            let pathToFile = `${this.baseUrl}${fileName}`;

            (<any>window).resolveLocalFileSystemURL(pathToFile, function (fileEntry) {
                fileEntry.file(function (file) {
                    let reader = new FileReader();

                    reader.onloadend = function (e) {
                        resolve(JSON.parse(this.result));
                    };

                    reader.readAsText(file);
                }, (reason) => {
                    reject(
                        new Error(
                            `fileEntry.file Failed.  ${that.errorHandler(fileName, reason)} Reason: ${JSON.stringify(reason)}`));
                });
            }, (reason) => {
                reject(
                    new Error(
                        `resolveLocalFileSystemURL Failed.  ${that.errorHandler(fileName, reason)} Reason: ${JSON.stringify(reason)}`));
            });
        });
    };

    public errorHandler = (fileName, e) => {
        let msg = '';

        switch (e.code) {
            case (<any>window).FileError.QUOTA_EXCEEDED_ERR:
                msg = 'Storage quota exceeded';
                break;
            case (<any>window).FileError.NOT_FOUND_ERR:
                msg = 'File not found';
                break;
            case (<any>window).FileError.SECURITY_ERR:
                msg = 'Security error';
                break;
            case (<any>window).FileError.INVALID_MODIFICATION_ERR:
                msg = 'Invalid modification';
                break;
            case (<any>window).FileError.INVALID_STATE_ERR:
                msg = 'Invalid state';
                break;
            default:
                msg = 'Unknown error';
                break;
        };

        return `Error (${fileName}): ${msg}`;
    }
}
