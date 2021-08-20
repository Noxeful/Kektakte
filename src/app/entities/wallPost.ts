import { WallComment } from './wallComment';

export class WallPost {
    public postId: number;
    public authorId: number;
    public authorName: string;
    public authorAvatar: string;
    public created: Date;
    public text: string;
    public picture: string;
    public likes: number;
    public dislikes: number;
    public comments: WallComment[];


    constructor(postId: number, authorId: number, authorName: string, avatar: string, created: Date, text: string, picture: string, likes: number, dislikes: number, comments: WallComment[]) {
        this.postId = postId;
        this.authorId = authorId;
        this.authorName = authorName;
        this.authorAvatar = avatar;
        this.created = created;
        this.text = text;
        this.picture = picture;
        this.likes = likes;
        this.dislikes = dislikes;
        this.comments = comments;
    }
}
