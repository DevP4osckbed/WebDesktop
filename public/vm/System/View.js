import { ViewManager } from './ViewManager.js';

export class View {
    constructor(mouse, x, y, width, height, zIndex = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.zIndex = zIndex;

        this.isHovered = false;
        this.isDragging = false;
        this.mouse = mouse;
        
        this.dragOffset = { x: 0, y: 0 };
        
        ViewManager.register(this);
    }

    contains(px, py) {
        return px >= this.x && px <= this.x + this.width &&
               py >= this.y && py <= this.y + this.height;
    }

    update(mouse, canInteract) {
        const wasHovered = this.isHovered;
        this.isHovered = canInteract && this.contains(mouse.pos.x, mouse.pos.y);

        // Hover events
        if (!wasHovered && this.isHovered) this.onMouseEnter();
        if (wasHovered && !this.isHovered) this.onMouseLeave();

        // Drag Start
        if (this.isHovered && mouse.getButtonPressed('left')) {
            this.isDragging = true;
            this.dragOffset.x = mouse.pos.x - this.x;
            this.dragOffset.y = mouse.pos.y - this.y;
            this.onDragStart();
        }
        
        // Dragging
        if (this.isDragging) {
            if (mouse.getButtonDown('left')) {
                this.onDrag();
            } else {
                this.isDragging = false;
                this.onDragEnd();
            }
        }
        
        if (this.isHovered && mouse.getButtonReleased('left')) {
            this.onClick();
        }
    }

    onMouseEnter() {}
    onMouseLeave() {}
    onDragStart() {}
    
    // Default drag behavior (can be overridden)
    onDrag() {
        this.x = this.mouse.pos.x - this.dragOffset.x;
        this.y = this.mouse.pos.y - this.dragOffset.y;
    }
    
    onDragEnd() {}
    onClick() {}

    draw(ctx) {
        ctx.fillStyle = this.isHovered ? 'rgba(255,255,255,0.1)' : 'transparent';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}