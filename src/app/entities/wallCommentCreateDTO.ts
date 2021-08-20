export class WallCommentCreateDTO {
    public authorId: number;
    public postId: number;
    public text: string;
    public picture: string;


    constructor(authorId: number, postId: number, text: string, picture: string) {
        this.authorId = authorId;
        this.postId = postId;
        this.text = text;
        this.picture = picture;
    }
}
