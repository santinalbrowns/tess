class Color {
    random: string;
    colors: Array<string> = [
        "#ff7e79",
        "#0096ff",
        "#00fa92",
        "#ff2f92",
        "#d783ff",
        "#009051"
    ];

    constructor() {
        const random = Math.floor(Math.random() * this.colors.length);

        this.random = this.colors[random];
    }
}

export default Color;