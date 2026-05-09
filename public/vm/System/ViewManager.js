export class ViewManager {
    static views =[];

    static register(view) {
        if (!this.views.includes(view)) {
            this.views.push(view);
            this.sort();
        }
    }

    static unregister(view) {
        this.views = this.views.filter(v => v !== view);
    }

    static sort() {
        this.views.sort((a, b) => a.zIndex - b.zIndex);
    }

    static update(mouse) {
        let foundHover = false;
        let isAnyDragging = this.views.some(v => v.isDragging);
        
        // Loop backwards (from highest Z to lowest Z)
        for (let i = this.views.length - 1; i >= 0; i--) {
            const view = this.views[i];
            const isMouseOver = view.contains(mouse.pos.x, mouse.pos.y);

            if (view.isDragging) {
                view.update(mouse, true); 
                foundHover = true; 
            } else if (!foundHover && !isAnyDragging && isMouseOver) {
                view.update(mouse, true);
                foundHover = true; 
            } else {
                view.update(mouse, false);
            }
        }
    }
}