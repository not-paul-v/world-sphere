export class ProjectionHelper {
    width: number;
    height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    mercator(lat: number, lon: number) {
        var widthPct = (lon + 180) / 360;
        var heightPct = (-lat + 90) / 180;
        var x = Math.floor(this.width * widthPct);
        var y = Math.floor(this.height * (1 - heightPct));

        return { x, y };
    }

    equirectangular(lat: number, lon: number) {
        const x = this.map(lat, -90, 90, 0, this.height);
        const y = this.map(lon, -180, 180, 0, this.width);

        return { x, y };
    }

    private clamp(input: number, min: number, max: number) {
        return input < min ? min : input > max ? max : input;
    }

    private map(
        current: number,
        in_min: number,
        in_max: number,
        out_min: number,
        out_max: number
    ) {
        const mapped: number =
            ((current - in_min) * (out_max - out_min)) / (in_max - in_min) +
            out_min;
        return this.clamp(mapped, out_min, out_max);
    }
}
