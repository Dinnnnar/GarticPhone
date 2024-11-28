import Tool from './Tool';

export default class Brush extends Tool {
    constructor(canvas, socket, roomId) {
        super(canvas, socket);
        this.listen();
        this.actions = [];
        this.roomId = roomId;
        this.mouseDown = false;
    }

    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
        this.canvas.onmousedown = this.mouseDownHandler.bind(this);
        this.canvas.onmouseup = this.mouseUpHandler.bind(this);

        this.canvas.ontouchstart = this.touchStartHandler.bind(this);
        this.canvas.ontouchmove = this.touchMoveHandler.bind(this);
        this.canvas.ontouchend = this.touchEndHandler.bind(this);
    }

    mouseUpHandler(e) {
        this.mouseDown = false;
        this.socket.emit('data', { data: this.actions, roomId: this.roomId });
    }

    mouseDownHandler(e) {
        this.mouseDown = true;
        this.ctx.beginPath();
        let x = e.pageX - e.target.offsetLeft;
        let y = e.pageY - e.target.offsetTop;
        this.actions.push(['beginPath']);
        this.actions.push(['moveTo', x, y]);
        this.ctx.moveTo(x, y);
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            let x = e.pageX - e.target.offsetLeft;
            let y = e.pageY - e.target.offsetTop;
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = 'black';
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
            this.actions.push(['lineTo', x, y]);
            this.actions.push(['stroke', 2, 'black']);
        }
    }

    touchStartHandler(e) {
        e.preventDefault();
        this.mouseDown = true;
        this.ctx.beginPath();
        const touch = e.touches[0];
        let x = touch.pageX - e.target.offsetLeft;
        let y = touch.pageY - e.target.offsetTop;
        this.actions.push(['beginPath']);
        this.actions.push(['moveTo', x, y]);
        this.ctx.moveTo(x, y);
    }

    touchMoveHandler(e) {
        e.preventDefault();
        if (this.mouseDown) {
            const touch = e.touches[0];
            let x = touch.pageX - e.target.offsetLeft;
            let y = touch.pageY - e.target.offsetTop;
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = 'black';
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
            this.actions.push(['lineTo', x, y]);
            this.actions.push(['stroke', 2, 'black']);
        }
    }

    touchEndHandler(e) {
        this.mouseDown = false;
        this.socket.emit('data', { data: this.actions, roomId: this.roomId });
    }
}
