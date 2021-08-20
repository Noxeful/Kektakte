export class MessageDTO {
    public authorId: number;
    public destinationId: number;


    constructor(authorId: number, destinationId: number) {
        this.authorId = authorId;
        this.destinationId = destinationId;
    }
}
