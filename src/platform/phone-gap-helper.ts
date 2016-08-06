export class PhoneGapHelper {
    public get isPhoneGap()  {
        return window.location
            && window.location.toString().startsWith('file:')
            && window.location.toString().indexOf('phonegap') > 0;
    };

}
