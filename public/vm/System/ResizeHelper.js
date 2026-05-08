import { View } from './View.js';

export class ResizeHelper extends View {
    constructor(mouse, parent, dir, x, y, w, h, zIndex = 10) {
        super(mouse, x, y, w, h, zIndex);
        this.parent = parent;
        this.dir = dir; // "n", "s", "e", "w", "se", etc.

        this.cursorMap = {
            'n':  'resize_vertical',
            's':  'resize_vertical',
            'e':  'resize_horizontal',
            'w':  'resize_horizontal',
            'ne': 'resize_right_diagonal',
            'sw': 'resize_right_diagonal',
            'nw': 'resize_left_diagonal',
            'se': 'resize_left_diagonal'
        };
    }

    onMouseEnter() {
        const cursor = this.cursorMap[this.dir];
        if (cursor) {
            this.mouse.setMouseIcon(cursor);
        }
    }

    onMouseLeave() {
        this.mouse.setMouseIcon('pointer');
    }

    onDrag() {
        const mousePos = this.mouse.pos;
        const p = this.parent;
        const min = p.minSize;

        if (this.dir.includes('e')) {
            p.width = Math.max(min.width, mousePos.x - p.x);
        }
        
        if (this.dir.includes('s')) {
            p.height = Math.max(min.height, mousePos.y - p.y);
        }
        
        if (this.dir.includes('w')) {
            const newWidth = p.x + p.width - mousePos.x;
            if (newWidth >= min.width) {
                p.x = mousePos.x;
                p.width = newWidth;
            } else {
                p.x = p.x + p.width - min.width;
                p.width = min.width;
            }
        }
        
        if (this.dir.includes('n')) {
            const newHeight = p.y + p.height - mousePos.y;
            if (newHeight >= min.height) {
                p.y = mousePos.y;
                p.height = newHeight;
            } else {
                p.y = p.y + p.height - min.height;
                p.height = min.height;
            }
        }
    }
}