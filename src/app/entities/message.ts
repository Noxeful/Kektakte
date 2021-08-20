export class Message {
    public messageId: number;
    public authorId: number;
    public destinationId: number;
    public created: Date;
    public text: string;
    public authorName: string;
    public destinationName: string;


    constructor(messageId: number, authorId: number, destinationId: number, created: Date, text: string,
                authorName: string, destinationName: string) {
        this.messageId = messageId;
        this.authorId = authorId;
        this.destinationId = destinationId;
        this.created = created;
        this.text = text;
        this.authorName = authorName;
        this.destinationName = destinationName;
    }
}
