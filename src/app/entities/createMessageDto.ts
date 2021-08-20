export class CreateMessageDto {
    public destinationId: number;
    public message: string;


    constructor(destinationId: number, message: string) {
        this.destinationId = destinationId;
        this.message = message;
    }
}
