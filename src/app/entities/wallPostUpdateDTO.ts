export class WallPostUpdateDTO {
    public postId: number;
    public text: string;
    public picture: string;


    constructor(postId: number, text: string, picture: string) {
        this.postId = postId;
        this.text = text;
        this.picture = picture;
    }
}