export class FriendsRequests {
    public userId: number;
    public requestedFriendId: number;
    public requestResponse: boolean;
    public isResponseGiven: boolean;


    constructor(userId: number, requestedFriendId: number, requestResponse: boolean, isResponseGiven: boolean) {
        this.userId = userId;
        this.requestedFriendId = requestedFriendId;
        this.requestResponse = requestResponse;
        this.isResponseGiven = isResponseGiven;
    }

}
