import { Mouse } from "./System/Mouse.js";
import { Window } from "./System/Window.js";
import { ViewManager } from "./System/ViewManager.js";

export class Session {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.active = false;
        
        this.mouse = new Mouse(this);
        this.window = new Window(this, this.mouse);
    }
    
    load() {
        console.log("VM Assets Loaded.");
    }

    init() {
        this.active = true;
        this.mouse.init();
    }

    handleInput(data) {
        const btnMap = ["left", "middle", "right", "button4", "button5"];
        switch (data.type) {
            case "mouseMove":
                this.mouse.update({ type: "delta", delta: data.delta }); 
                break;
            case "mouseDown":
                this.mouse.update({ type: "button", button: [btnMap[data.button], true] });
                break;
            case "mouseUp":
                this.mouse.update({ type: "button", button: [btnMap[data.button], false] });
                break;
            default:
                console.warn("Unknown input type:", data.type);
        }
    }

    loop() {
        if (!this.active) return;

        // 1. Update logic
        ViewManager.update(this.mouse);
        this.window.update(this.mouse);
        
        // 2. Clear and Draw
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.window.draw(this.ctx);
        this.mouse.draw(this.ctx);

        // 3. Record state for NEXT frame at the very end
        this.mouse.lastButtons = { ...this.mouse.buttons };
    }
    
    cleanup() {
        this.active = false;
        if (document.pointerLockElement) {
            document.exitPointerLock();
        }
    }
}