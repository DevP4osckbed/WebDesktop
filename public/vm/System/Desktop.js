//System/Desktop.js
import { Window } from './Window.js';

export class Desktop {
    constructor(session, mouse) {
        this.session = session;
        this.canvas = session.canvas;
        this.mouse = mouse;

        this.windows = [];
    }

    createWindow(x, y, width, height) {
        const win = new Window(this.session, this.mouse, x, y, width, height);
        this.windows.push(win);
        return win;
    }

    update() {
        for (const win of this.windows) {
            win.update(this.mouse);
        }
    }

    draw(ctx) {
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (const win of this.windows) {
            win.draw(ctx);
        }
    }
}