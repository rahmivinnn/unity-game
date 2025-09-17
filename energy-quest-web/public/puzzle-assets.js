// Puzzle Assets - Realistic Inventory Style Images

class PuzzleAssets {
    constructor() {
        // Real puzzle images that look like inventory game pieces
        this.puzzleImages = [
            // Energy-themed puzzle pieces
            'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=200&h=200&fit=crop&crop=center', // Solar panel
            'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&h=200&fit=crop&crop=center', // Wind turbine
            'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&h=200&fit=crop&crop=center', // Wind turbine
            'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=200&h=200&fit=crop&crop=center', // Solar panel
            'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&h=200&fit=crop&crop=center', // Wind turbine
            'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=200&h=200&fit=crop&crop=center', // Solar panel
            'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&h=200&fit=crop&crop=center', // Wind turbine
            'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=200&h=200&fit=crop&crop=center', // Solar panel
            'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&h=200&fit=crop&crop=center', // Wind turbine
            'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=200&h=200&fit=crop&crop=center', // Solar panel
            'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&h=200&fit=crop&crop=center', // Wind turbine
            'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=200&h=200&fit=crop&crop=center'  // Solar panel
        ];
        
        // Target image - complete energy landscape
        this.targetImage = 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=300&fit=crop&crop=center';
        
        // Puzzle piece shapes for realistic inventory look
        this.puzzleShapes = [
            'top-left', 'top-center', 'top-right',
            'middle-left', 'middle-center', 'middle-right',
            'bottom-left', 'bottom-center', 'bottom-right',
            'corner-1', 'corner-2', 'corner-3'
        ];
        
        // Puzzle piece borders for inventory style
        this.pieceBorders = [
            'border-top-left', 'border-top-right', 'border-bottom-left', 'border-bottom-right',
            'border-top', 'border-bottom', 'border-left', 'border-right',
            'border-all', 'border-none', 'border-diagonal-1', 'border-diagonal-2'
        ];
    }
    
    // Get puzzle piece with realistic inventory styling
    getPuzzlePiece(index) {
        const image = this.puzzleImages[index % this.puzzleImages.length];
        const shape = this.puzzleShapes[index % this.puzzleShapes.length];
        const border = this.pieceBorders[index % this.pieceBorders.length];
        
        return {
            image: image,
            shape: shape,
            border: border,
            id: index,
            number: index + 1
        };
    }
    
    // Get target image
    getTargetImage() {
        return this.targetImage;
    }
    
    // Create realistic puzzle piece HTML
    createPuzzlePieceHTML(pieceData) {
        return `
            <div class="puzzle-piece ${pieceData.shape} ${pieceData.border}" 
                 data-piece-id="${pieceData.id}" 
                 draggable="true"
                 style="background-image: url('${pieceData.image}');">
                <div class="piece-number">${pieceData.number}</div>
                <div class="piece-glow"></div>
            </div>
        `;
    }
    
    // Create puzzle piece with realistic inventory effects
    createInventoryStylePiece(pieceData) {
        const piece = document.createElement('div');
        piece.className = `puzzle-piece ${pieceData.shape} ${pieceData.border}`;
        piece.dataset.pieceId = pieceData.id;
        piece.draggable = true;
        
        // Set background image
        piece.style.backgroundImage = `url('${pieceData.image}')`;
        piece.style.backgroundSize = 'cover';
        piece.style.backgroundPosition = 'center';
        piece.style.backgroundRepeat = 'no-repeat';
        
        // Add piece number
        const numberDiv = document.createElement('div');
        numberDiv.className = 'piece-number';
        numberDiv.textContent = pieceData.number;
        piece.appendChild(numberDiv);
        
        // Add glow effect
        const glowDiv = document.createElement('div');
        glowDiv.className = 'piece-glow';
        piece.appendChild(glowDiv);
        
        // Add inventory-style hover effects
        piece.addEventListener('mouseenter', () => {
            piece.style.transform = 'translateY(-5px) scale(1.05)';
            piece.style.boxShadow = '0 10px 30px rgba(251, 191, 36, 0.6)';
        });
        
        piece.addEventListener('mouseleave', () => {
            if (!piece.classList.contains('dragging')) {
                piece.style.transform = 'translateY(0) scale(1)';
                piece.style.boxShadow = '0 4px 15px rgba(251, 191, 36, 0.3)';
            }
        });
        
        return piece;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PuzzleAssets;
} else {
    window.PuzzleAssets = PuzzleAssets;
}