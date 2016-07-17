export class Shell {
    public hostId: string;
    public sessionId: string;

    public activate(params) {
        this.hostId = params.hostId;
        this.sessionId = params.sessionId;
    }
}
