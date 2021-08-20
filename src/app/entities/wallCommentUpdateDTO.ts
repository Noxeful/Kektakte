export class WallCommentUpdateDTO {
    public commentId: number;
    public text: string;
    public picture: string;


    constructor(commentId: number, text: string, picture: string) {
        this.commentId = commentId;
        this.text = text;
        this.picture = picture;
    }
}