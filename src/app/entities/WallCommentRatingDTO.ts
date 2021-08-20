export class WallCommentRatingDTO {
    public commentId: number;
    public rating: boolean;

    constructor(commentId: number, rating: boolean) {
        this.commentId = commentId;
        this.rating = rating;
    }
}