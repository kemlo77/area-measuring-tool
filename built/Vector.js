class Vector {
    //TODO: ytterligare konstruktor där man anger x och y-komponent
    constructor(punkt1, punkt2) {
        if (punkt1 === null || punkt2 === null) {
            this.x = 0;
            this.y = 0;
        }
        else {
            this.x = punkt2.x - punkt1.x;
            this.y = punkt2.y - punkt1.y;
        }
    }
    //calculate lenght of a vector
    vLength() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
}
