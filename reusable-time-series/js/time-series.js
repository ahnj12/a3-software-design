class TimeSeriesChart {
    constructor() {
        this._width = 200;
        this._height = 100;
    }

    // render chart here
    call(selection) {
        // console.log(this);
        selection.each((data, index) => {
            console.log("Generating chart");
            // console.log(this);
            console.log(`Width: ${this._width}`);
            console.log(`Height: ${this._height}`);
            console.log(data);
        
        })
    }

    width(value) {
        if (value) {
            this._width = value;
        }
        return this;
    }

    height(value) {
        if (value) {
            this._height = value;
        }
        return this;
    }
}