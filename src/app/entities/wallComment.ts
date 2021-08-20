export class WallComment {
    public commentId: number;
    public authorId: number;
    public authorName: string;
    public authorAvatar: string;
    public created: Date;
    public postId: number;
    public text: string;
    public picture: string;
    public likes: number;
    public dislikes: number;


    constructor(commentId: number, authorId: number, authorName: string, authorAvatar: string, created: Date, postId: number, text: string, picture: string, likes: number, dislikes: number) {
        this.commentId = commentId;
        this.authorId = authorId;
        this.authorName = authorName;
        this.authorAvatar = authorAvatar;
        this.created = created;
        this.postId = postId;
        this.text = text;
        this.picture = picture;
        this.likes = likes;
        this.dislikes = dislikes;
    }
}
