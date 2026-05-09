import { View } from './View.js';
import { ResizeHelper } from './ResizeHelper.js';

export class Window {
    constructor(session, mouse, x = 50, y = 50, width = 400, height = 300) {
        this.session = session;
        this.canvas = session.canvas;
        this.mouse = mouse;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.minSize = { width: 150, height: 100 };
        this.margin = 8; 

        // Title bar (handle) zIndex 5
        this.handle = new View(mouse, x, y, width, 20, 5);
        
        this.resizers =[];
        this.initResizers();

        this.title = "Window";
        this.isClosed = false;

        this.content = new OffscreenCanvas(this.width, this.height - this.handle.height);
        this.contentCtx = this.content.getContext('2d');

    }

    initResizers() {
        const m = this.mouse;
        
        // Edge resizers (Z-index 10)
        const n = new ResizeHelper(m, this, 'n', 0, 0, 0, 0, 10);
        const s = new ResizeHelper(m, this, 's', 0, 0, 0, 0, 10);
        const e = new ResizeHelper(m, this, 'e', 0, 0, 0, 0, 10);
        const w = new ResizeHelper(m, this, 'w', 0, 0, 0, 0, 10);
        
        // Corner resizers (Z-index 11)
        const se = new ResizeHelper(m, this, 'se', 0, 0, 0, 0, 11);
        const sw = new ResizeHelper(m, this, 'sw', 0, 0, 0, 0, 11);
        const ne = new ResizeHelper(m, this, 'ne', 0, 0, 0, 0, 11);
        const nw = new ResizeHelper(m, this, 'nw', 0, 0, 0, 0, 11);

        this.resizers =[n, s, e, w, se, sw, ne, nw];
    }

    update(mouse) {
        if (this.isClosed) return;

        // Sync window position to handle ONLY if the handle is actively being dragged
        if (this.handle.isDragging) {
            this.x = this.handle.x;
            this.y = this.handle.y;
        }

        this.constrain();

        // Enforce synchronization back to hitboxes (handles & resizers)
        this.handle.x = this.x;
        this.handle.y = this.y;
        this.handle.width = this.width; 

        this.updateResizerBounds();
    }

    updateResizerBounds() {
        const t = this.margin;
        const [n, s, e, w, se, sw, ne, nw] = this.resizers;

        // Edge Hitboxes
        n.x = this.x + t;                 n.y = this.y - t/2;               n.width = this.width - t*2; n.height = t;
        s.x = this.x + t;                 s.y = this.y + this.height - t/2; s.width = this.width - t*2; s.height = t;
        e.x = this.x + this.width - t/2;  e.y = this.y + t;                 e.width = t;                e.height = this.height - t*2;
        w.x = this.x - t/2;               w.y = this.y + t;                 w.width = t;                w.height = this.height - t*2;

        // Corner Hitboxes
        nw.x = this.x - t/2;              nw.y = this.y - t/2;              nw.width = t; nw.height = t;
        ne.x = this.x + this.width - t/2; ne.y = this.y - t/2;              ne.width = t; ne.height = t;
        sw.x = this.x - t/2;              sw.y = this.y + this.height - t/2; sw.width = t; sw.height = t;
        se.x = this.x + this.width - t/2; se.y = this.y + this.height - t/2; se.width = t; se.height = t;
    }

    constrain() {
        this.x = Math.max(0, Math.min(this.x, this.canvas.width - this.width));
        this.y = Math.max(0, Math.min(this.y, this.canvas.height - this.height));
    }

    draw(ctx) {
        if (this.isClosed) return;

        // Window Background
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Window Border
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        this.drawTitleBar(ctx);

        // Draw content area (for demonstration, fill with a color)
        this.contentCtx.fillStyle = '#2e2e2e';
        this.contentCtx.fillRect(0, 0, this.content.width, this.content.height);
        ctx.drawImage(this.content, this.x, this.y + this.handle.height);
        ctx.fillText(`Content Area (${this.content.width}x${this.content.height})`, this.x + 10, this.y + this.handle.height + 20);
    }

    drawTitleBar(ctx) {
        this.handle.draw(ctx);
        ctx.fillStyle = '#ebebeb';
        ctx.font = '14px monospace';
        ctx.fillText(this.title, this.x + 10, this.y + 15);
    }
}