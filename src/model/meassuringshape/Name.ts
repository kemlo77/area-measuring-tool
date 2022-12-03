export class Name {

    private _name: string;

    constructor(name: string) {
        const trimmedName: string = name.trim();
        if (!this.nameIsValid(trimmedName)) {
            throw new Error('Invalid parameters');
        }
        this._name = trimmedName;
    }

    get value(): string {
        return this._name;
    }

    private nameIsValid(name: string): boolean {
        if (name.length == 0) {
            return false;
        }
        if (name.length > 40) {
            return false;
        }
        return true;
    }

}