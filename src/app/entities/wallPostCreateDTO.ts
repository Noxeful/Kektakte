export class WallPostCreateDTO {
    public authorId: number;
    public postedOnWallId: number;
    public text: string;
    public picture: string;


    constructor(authorId: number, postedOnWallId: number, text: string, picture: string) {
        this.authorId = authorId;
        this.postedOnWallId = postedOnWallId;
        this.text = text;
        this.picture = picture;
    }
}
