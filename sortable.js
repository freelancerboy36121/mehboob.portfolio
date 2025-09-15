
/**
 * Simple Sortable Library for Admin Panel
 * Provides drag and drop functionality for reordering elements
 */
class Sortable {
    constructor(el, options = {}) {
        this.el = el;
        this.options = {
            animation: 150,
            onEnd: null,
            ...options
        };
        
        this.dragged = null;
        this.init();
    }

    init() {
        this.el.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.el.addEventListener('touchstart', this.onTouchStart.bind(this));
    }

    onMouseDown(e) {
        if (e.target.closest('li')) {
            this.startDrag(e, e.target.closest('li'));
        }
    }

    onTouchStart(e) {
        if (e.target.closest('li')) {
            this.startDrag(e, e.target.closest('li'));
        }
    }

    startDrag(e, item) {
        e.preventDefault();
        
        this.dragged = item;
        this.dragged.style.opacity = '0.5';
        this.dragged.style.transform = 'rotate(5deg)';
        
        // Create ghost element
        this.ghost = this.dragged.cloneNode(true);
        this.ghost.style.position = 'fixed';
        this.ghost.style.top = e.clientY + 'px';
        this.ghost.style.left = e.clientX + 'px';
        this.ghost.style.width = this.dragged.offsetWidth + 'px';
        this.ghost.style.zIndex = '10000';
        this.ghost.style.pointerEvents = 'none';
        this.ghost.style.opacity = '0.8';
        document.body.appendChild(this.ghost);
        
        // Add event listeners
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
        document.addEventListener('touchmove', this.onTouchMove.bind(this));
        document.addEventListener('touchend', this.onTouchEnd.bind(this));
    }

    onMouseMove(e) {
        if (this.ghost) {
            this.ghost.style.top = e.clientY + 'px';
            this.ghost.style.left = e.clientX + 'px';
            this.updateDropZone(e);
        }
    }

    onTouchMove(e) {
        if (this.ghost && e.touches[0]) {
            const touch = e.touches[0];
            this.ghost.style.top = touch.clientY + 'px';
            this.ghost.style.left = touch.clientX + 'px';
            this.updateDropZone(touch);
        }
    }

    updateDropZone(e) {
        const items = Array.from(this.el.children);
        const dropZone = this.findDropZone(e, items);
        
        if (dropZone && dropZone !== this.dragged) {
            // Remove existing drop indicators
            items.forEach(item => item.classList.remove('drop-above', 'drop-below'));
            
            const rect = dropZone.getBoundingClientRect();
            const midY = rect.top + rect.height / 2;
            
            if (e.clientY < midY) {
                dropZone.classList.add('drop-above');
            } else {
                dropZone.classList.add('drop-below');
            }
        }
    }

    findDropZone(e, items) {
        for (let item of items) {
            if (item === this.dragged) continue;
            
            const rect = item.getBoundingClientRect();
            if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
                return item;
            }
        }
        return null;
    }

    onMouseUp(e) {
        this.endDrag(e);
    }

    onTouchEnd(e) {
        this.endDrag(e);
    }

    endDrag(e) {
        if (this.dragged && this.ghost) {
            // Find final position
            const items = Array.from(this.el.children);
            const dropZone = this.findDropZone(e, items);
            
            if (dropZone) {
                const rect = dropZone.getBoundingClientRect();
                const midY = rect.top + rect.height / 2;
                
                if (e.clientY < midY) {
                    dropZone.parentNode.insertBefore(this.dragged, dropZone);
                } else {
                    dropZone.parentNode.insertBefore(this.dragged, dropZone.nextSibling);
                }
            }
            
            // Clean up
            this.cleanup();
            
            // Call onEnd callback
            if (this.options.onEnd) {
                this.options.onEnd({
                    item: this.dragged,
                    newIndex: Array.from(this.el.children).indexOf(this.dragged)
                });
            }
        }
    }

    cleanup() {
        if (this.dragged) {
            this.dragged.style.opacity = '';
            this.dragged.style.transform = '';
            this.dragged.classList.remove('drop-above', 'drop-below');
        }
        
        if (this.ghost) {
            document.body.removeChild(this.ghost);
        }
        
        // Remove event listeners
        document.removeEventListener('mousemove', this.onMouseMove.bind(this));
        document.removeEventListener('mouseup', this.onMouseUp.bind(this));
        document.removeEventListener('touchmove', this.onTouchMove.bind(this));
        document.removeEventListener('touchend', this.onTouchEnd.bind(this));
        
        this.dragged = null;
        this.ghost = null;
    }

    destroy() {
        this.cleanup();
        // Remove event listeners from el if needed
    }
}

// Add CSS for drop indicators
const style = document.createElement('style');
style.textContent = `
    .drop-above {
        border-top: 3px solid #ffd700 !important;
        margin-top: 10px;
    }
    
    .drop-below {
        border-bottom: 3px solid #ffd700 !important;
        margin-bottom: 10px;
    }
    
    .sortable-list li {
        transition: all 0.2s ease;
    }
    
    .sortable-list li:hover {
        transform: translateY(-2px);
    }
`;
document.head.appendChild(style);