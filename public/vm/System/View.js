// System/View.js
export class View {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.isHovered = false;
        this.isDragging = false;
        
        // Offset to keep the mouse stuck to the same spot on the view during drag
        this.dragOffset = { x: 0, y: 0 };
    }

    /**
     * Checks if a coordinate is within this view's bounds
     */
    contains(px, py) {
        return px >= this.x && px <= this.x + this.width &&
               py >= this.y && py <= this.y + this.height;
    }

    update(mouse) {
        const wasHovered = this.isHovered;
        this.isHovered = this.contains(mouse.pos.x, mouse.pos.y);

        // 1. Handle Mouse Enter/Leave
        if (!wasHovered && this.isHovered) this.onMouseEnter();
        if (wasHovered && !this.isHovered) this.onMouseLeave();

        // 2. Handle Drag Start
        if (this.isHovered && mouse.getButtonPressed('left')) {
            this.isDragging = true;
            this.dragOffset.x = mouse.pos.x - this.x;
            this.dragOffset.y = mouse.pos.y - this.y;
            this.onDragStart();
        }
        
        // 3. Handle Dragging (Update position)
        if (this.isDragging) {
            if (mouse.getButtonDown('left')) {
                this.x = mouse.pos.x - this.dragOffset.x;
                this.y = mouse.pos.y - this.dragOffset.y;
                this.onDrag();
            } else {
                this.isDragging = false;
                this.onDragEnd();
            }
        }
        
        // 4. Handle Clicks
        if (this.isHovered && mouse.getButtonReleased('left')) {
            this.onClick();
        }
    }

    // Event Hooks (Override these in subclasses like Button or Window)
    onMouseEnter() {}
    onMouseLeave() {}
    onDragStart() {}
    onDrag()      {}
    onDragEnd()   {}
    onClick()     {}

    draw(ctx) {
        // Base drawing logic
        ctx.fillStyle = this.isHovered ? '#444' : '#222';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        if (this.isDragging) {
            ctx.strokeStyle = 'cyan';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}
