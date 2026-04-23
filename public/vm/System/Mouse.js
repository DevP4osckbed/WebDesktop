// System/Mouse.js
export class Mouse {
    constructor(session) {  
        this.session = session;
        this.canvas = session.canvas;

        this.buttons = { 
            left: false,
            middle: false, 
            right: false, 
            button4: false, 
            button5: false 
        };

        this.lastButtons = {
            left: false,
            middle: false, 
            right: false, 
            button4: false, 
            button5: false
        };
        
        // Stores { x, y } when dragging begins, or null
        this.lastDrag = {
            left: null,
            middle: null,
            right: null,
            button4: null,
            button5: null
        };

        this.pos = { x: 0, y: 0 };
        this.sensitivity = 1.0; 
    }

    init() {
        this.pos.x = this.canvas.width / 2;
        this.pos.y = this.canvas.height / 2;
    }

    update(info) {
        switch (info.type) {
            case "delta":
                this.pos.x += info.delta.x * this.sensitivity;
                this.pos.y += info.delta.y * this.sensitivity;
                break;

            case "button":
                const buttonName = info.button[0];
                const isDown = info.button[1];

                // Update the button state
                this.buttons[buttonName] = isDown;

                // Handle Drag Start/Stop
                if (isDown) {
                    // If the button was just pressed, record the start position
                    if (!this.lastButtons[buttonName]) {
                        this.lastDrag[buttonName] = { x: this.pos.x, y: this.pos.y };
                    }
                } else {
                    // Button released, clear the drag start point
                    this.lastDrag[buttonName] = null;
                }
                break;
        }
        this.contrain();
    }

    /**
     * Returns the start coordinates if a button is currently being dragged, 
     * otherwise returns null.
     */
    getDragStart(button) {
        return this.lastDrag[button];
    }

    /**
     * Optional: Helper to get the distance moved since the drag started
     */
    getDragDelta(button) {
        const start = this.lastDrag[button];
        if (!start) return { x: 0, y: 0 };
        return {
            x: this.pos.x - start.x,
            y: this.pos.y - start.y
        };
    }

    getButtonPressed(button) {
        return this.buttons[button] && !this.lastButtons[button];
    }

    getButtonReleased(button) {
        return !this.buttons[button] && this.lastButtons[button];
    }

    getButtonDown(button) {
        return this.buttons[button];
    }

    contrain() {
        if (this.pos.x < 0) this.pos.x = 0;
        if (this.pos.x > this.canvas.width) this.pos.x = this.canvas.width;
        if (this.pos.y < 0) this.pos.y = 0;
        if (this.pos.y > this.canvas.height) this.pos.y = this.canvas.height;
    }

    draw(ctx) {
        // Draw drag connection line and origin point
        if (this.lastDrag.left) {
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.moveTo(this.pos.x, this.pos.y);
            ctx.lineTo(this.lastDrag.left.x, this.lastDrag.left.y);
            ctx.stroke();
        }

        // Draw actual cursor
        ctx.fillStyle = 'white';
        ctx.fillRect(this.pos.x - 5, this.pos.y - 5, 10, 10);
    }
}