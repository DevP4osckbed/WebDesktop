export class Window {
    constructor(session) {
        this.session = session;
        this.canvas = session.canvas;
        
        this.pos = { x: 50, y: 50 };
        this.size = { width: 400, height: 300 };
        this.minSize = { width: 150, height: 100 };
        
        this.titleHeight = 30;
        this.resizeMargin = 25; 
        
        this.status = "normal"; // "normal", "dragging", "resizing"
        this.isClosed = false;

        this.offscreen = new OffscreenCanvas(this.size.width, this.size.height - this.titleHeight);
        this.offscreenCtx = this.offscreen.getContext('2d');

        this.mouse = null;
        this.dragOffset = { x: 0, y: 0 };
    }

    init(mouse) {
        this.mouse = mouse;
        this.resizeOffscreen();
    }

    resizeOffscreen() {
        this.offscreen.width = Math.max(1, this.size.width);
        this.offscreen.height = Math.max(1, this.size.height - this.titleHeight);
    }

    update() {
        if (this.isClosed) return;

        const mx = this.mouse.pos.x;
        const my = this.mouse.pos.y;
        const isLeftDown = this.mouse.getButtonDown('left');
        const isLeftPressed = this.mouse.getButtonPressed('left');

        // --- STATE HANDLING ---

        if (this.status === "dragging") {
            if (isLeftDown) {
                this.pos.x = mx - this.dragOffset.x;
                this.pos.y = my - this.dragOffset.y;
            } else {
                this.status = "normal";
            }
        } 
        else if (this.status === "resizing") {
            if (isLeftDown) {
                this.size.width = Math.max(this.minSize.width, mx - this.pos.x);
                this.size.height = Math.max(this.minSize.height, my - this.pos.y);
                this.resizeOffscreen();
            } else {
                this.status = "normal";
            }
        } 
        // --- DETECTION LOGIC (Only if not already dragging/resizing) ---
        else if (isLeftPressed) {
            // 1. Close Button Check (Top Right)
            const closeBtn = { 
                x: this.pos.x + this.size.width - 26, 
                y: this.pos.y + 4, 
                w: 22, h: 22 
            };
            if (this.pointInRect(mx, my, closeBtn)) {
                this.isClosed = true;
                return;
            }

            // 2. Title Bar Check (Dragging)
            const titleBar = { 
                x: this.pos.x, 
                y: this.pos.y, 
                w: this.size.width, 
                h: this.titleHeight 
            };
            if (this.pointInRect(mx, my, titleBar)) {
                this.status = "dragging";
                this.dragOffset.x = mx - this.pos.x;
                this.dragOffset.y = my - this.pos.y;
                return; // Exit early so we don't trigger resize
            }

            // 3. Border Check (Resizing)
            // Area: Inside outer shell BUT outside the actual window body
            const shell = { 
                x: this.pos.x, 
                y: this.pos.y, 
                w: this.size.width + this.resizeMargin, 
                h: this.size.height + this.resizeMargin 
            };
            const body = { 
                x: this.pos.x, 
                y: this.pos.y, 
                w: this.size.width, 
                h: this.size.height 
            };

            if (this.pointInRect(mx, my, shell) && !this.pointInRect(mx, my, body)) {
                this.status = "resizing";
            }
        }

        this.constrain();
    }

    pointInRect(px, py, rect) {
        return px >= rect.x && px <= rect.x + rect.w && 
               py >= rect.y && py <= rect.y + rect.h;
    }

    constrain() {
        // Prevents dragging/resizing entirely outside the viewport
        this.pos.x = Math.max(-this.size.width + 50, Math.min(this.pos.x, this.canvas.width - 50));
        this.pos.y = Math.max(0, Math.min(this.pos.y, this.canvas.height - this.titleHeight));
    }

    draw(ctx) {
        if (this.isClosed) return;

        // Window Outline (Highlights when active)
        ctx.strokeStyle = (this.status !== "normal") ? '#007acc' : '#444';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.pos.x, this.pos.y, this.size.width, this.size.height);

        // Background
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(this.pos.x, this.pos.y, this.size.width, this.size.height);

        // Title Bar
        ctx.fillStyle = (this.status === "dragging") ? '#333' : '#252526';
        ctx.fillRect(this.pos.x, this.pos.y, this.size.width, this.titleHeight);
        
        // Title text
        ctx.fillStyle = '#ccc';
        ctx.font = '13px Arial';
        ctx.fillText("Virtual Machine", this.pos.x + 10, this.pos.y + 20);

        // Close Button
        ctx.fillStyle = '#e81123';
        ctx.fillRect(this.pos.x + this.size.width - 26, this.pos.y + 4, 22, 22);
        ctx.fillStyle = 'white';
        ctx.fillText("✕", this.pos.x + this.size.width - 20, this.pos.y + 19);

        // Window Content Area
        ctx.drawImage(this.offscreen, this.pos.x, this.pos.y + this.titleHeight);
        
        // Debug: Show Resize Hitbox (Optional - remove when done)
        if (this.status === "resizing") {
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(this.pos.x, this.pos.y, this.size.width + this.resizeMargin, this.size.height + this.resizeMargin);
            ctx.setLineDash([]);
        }
    }
}