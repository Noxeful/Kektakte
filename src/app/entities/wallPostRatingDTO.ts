export class WallPostRatingDTO {
    public postId: number;
    public rating: boolean;

    constructor(postId: number, rating: boolean) {
        this.postId = postId;
        this.rating = rating;
    }
}