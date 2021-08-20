export class UserData {
    public id: number;
    public name: string;
    public lastName: string;
    public birthDate: Date;
    public city: string;
    public language: string;
    public ideology: string;
    public status: string;


    constructor(id: number, name: string, lastName: string, birthDate: Date, city: string, language: string, ideology: string, status: string) {
        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.birthDate = birthDate;
        this.city = city;
        this.language = language;
        this.ideology = ideology;
        this.status = status;
    }
}
