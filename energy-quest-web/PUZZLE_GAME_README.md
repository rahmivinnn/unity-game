# Puzzle Game - Inventory Style

## Overview
Game puzzle yang terintegrasi dengan Energy Quest yang menampilkan puzzle asli dengan gaya inventory game yang sesungguhnya.

## Features

### 🧩 Realistic Puzzle Pieces
- **Gambar Asli**: Menggunakan gambar energi terbarukan dari Unsplash yang terlihat seperti puzzle inventory game
- **Bentuk Realistis**: Setiap kepingan puzzle memiliki bentuk yang berbeda (top-left, top-center, corner, dll.)
- **Efek Visual**: Glow effect, shine animation, dan hover effects yang membuat puzzle terlihat hidup
- **Nomor Kepingan**: Setiap kepingan memiliki nomor untuk memudahkan identifikasi

### 🎮 Inventory System
- **Grid Inventory**: Kepingan puzzle disimpan dalam grid 3x4 yang terorganisir
- **Drag & Drop**: Sistem drag and drop yang smooth dan responsif
- **Visual Feedback**: Highlight saat hover, sparkle effect saat berhasil ditempatkan
- **Progress Tracking**: Progress bar yang menunjukkan persentase penyelesaian puzzle

### 🎯 Puzzle Board
- **Grid 4x3**: Area puzzle dengan 12 slot untuk menempatkan kepingan
- **Visual Cues**: Highlight slot yang bisa diisi, visual feedback saat drag over
- **Target Image**: Preview gambar target yang harus diselesaikan
- **Completion Check**: Otomatis mengecek apakah puzzle sudah selesai

### 🎨 Visual Effects
- **Anime Style**: Desain yang mengikuti gaya anime dengan warna-warna cerah
- **Smooth Animations**: Transisi yang halus untuk semua interaksi
- **Particle Effects**: Sparkle effect saat berhasil menempatkan kepingan
- **Glow Effects**: Glow effect pada kepingan puzzle dan elemen interaktif

### 🔗 Integration
- **Energy Game Link**: Terintegrasi dengan energy game yang sudah ada
- **Seamless Navigation**: Navigasi yang smooth antar game
- **Unified Design**: Konsisten dengan desain energy game

## Technical Implementation

### Files Structure
```
puzzle-game.html          # Main puzzle game page
puzzle-game.css           # Styling untuk puzzle game
puzzle-game.js            # Logic dan functionality
puzzle-assets.js          # Asset management dan realistic images
```

### Key Classes
- `PuzzleGame`: Main game controller
- `PuzzleAssets`: Asset management untuk gambar dan styling
- `PuzzlePiece`: Individual puzzle piece management

### Features Implementation
1. **Realistic Images**: Menggunakan Unsplash API untuk gambar energi terbarukan
2. **Clip Path**: CSS clip-path untuk membuat bentuk puzzle yang realistis
3. **Drag & Drop**: Native HTML5 drag and drop API
4. **CSS Animations**: Keyframe animations untuk efek visual
5. **Responsive Design**: Mobile-friendly design

## Usage

### Starting the Game
1. Buka `puzzle-game.html` di browser
2. Klik kepingan puzzle di inventory
3. Drag kepingan ke area puzzle
4. Susun semua kepingan untuk menyelesaikan puzzle

### Navigation
- **Puzzle Zone**: Area utama untuk bermain puzzle
- **Energy Game**: Link ke energy game setelah puzzle selesai
- **Progress Tracking**: Monitor progress di HUD

## Customization

### Adding New Images
Edit `puzzle-assets.js` untuk menambahkan gambar puzzle baru:
```javascript
this.puzzleImages = [
    'your-image-url-1',
    'your-image-url-2',
    // ... more images
];
```

### Changing Grid Size
Edit `puzzle-game.js` untuk mengubah ukuran grid:
```javascript
this.gridSize = { rows: 3, cols: 4 }; // 3x4 grid
```

### Styling
Edit `puzzle-game.css` untuk mengubah tampilan:
- Colors: Ubah color scheme
- Animations: Modifikasi keyframe animations
- Layout: Sesuaikan grid dan positioning

## Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance
- Optimized images dengan proper sizing
- Efficient drag and drop implementation
- Smooth 60fps animations
- Minimal memory usage

## Future Enhancements
- [ ] Sound effects untuk setiap interaksi
- [ ] Multiple puzzle levels
- [ ] Timer dan scoring system
- [ ] Hint system
- [ ] Save/load progress
- [ ] Multiplayer support

## Credits
- Images: Unsplash (Energy & Renewable Energy)
- Icons: Emoji (Unicode)
- Fonts: Google Fonts (Nunito, Fredoka One)
- Inspiration: Inventory puzzle games