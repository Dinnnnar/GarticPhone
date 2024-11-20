export default class Tool {
    constructor(canvas, socket) {
        this.socket = socket;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.destroyEvents();
    }

    set strokeColor(color) {
        this.ctx.strokeStyle = color;
    }

    set lineWidth(width) {
        this.ctx.lineWidth = width;
    }

    destroyEvents() {
        this.canvas.onmousemove = null;
        this.canvas.onmousedown = null;
        this.canvas.onmouseup = null;
    }
}
