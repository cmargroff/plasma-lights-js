type Color = [number, number, number, number]

const clamp8Bits = (n: number) => {
    return Math.min(255, Math.max(0, n))
}

export abstract class PlasmaAdapter {
    protected clearOnExit: boolean = false
    protected pixels: Color[] = []
    constructor(protected pixelCount: number = 1) {
        this.pixelCount = pixelCount
        for (let i = 0; i < pixelCount; i++) {
            this.pixels.push([0, 0, 0, 0])
        }
    }
    get_pixel_count() {
        return this.pixelCount
    }
    get_pixel(pixelId: number): Color {
        return this.pixels[pixelId]
    }
    set_pixel(pixelId: number, r: number, g: number, b: number, brightness?: number) {
        const [, , , currentBrightness] = this.pixels[pixelId]

        this.pixels[pixelId] = [
            clamp8Bits(r), clamp8Bits(g), clamp8Bits(b), brightness !== undefined ? clamp8Bits(brightness) : currentBrightness
        ]
    }
    set_all(r: number, g: number, b: number, brightness?: number) {
        for (let i = 0; i < this.pixelCount; i++) {
            this.set_pixel(i, r, g, b, brightness)
        }
    }
    set_clear_on_exit(val: boolean) {
        this.clearOnExit = val
    }
    blank(){
        this.set_all(0,0,0,0)
    }
}