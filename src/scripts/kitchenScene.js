// Kitchen Scene - Level 2: Energy Efficiency
class KitchenScene {
  constructor() {
    this.container = document.getElementById('kitchen-container');
    this.gameState = {
      appliances: {
        fridge: { active: true, power: 150, efficiency: 0.8 },
        microwave: { active: false, power: 1000, efficiency: 0.7 },
        riceCooker: { active: false, power: 500, efficiency: 0.9 },
        blender: { active: false, power: 300, efficiency: 0.6 },
        toaster: { active: false, power: 800, efficiency: 0.8 }
      },
      totalPower: 150,
      maxPower: 2000,
      efficiency: 0,
      energyKeyCollected: false
    };
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.updateDisplay();
    this.createKitchenContainer();
  }
  
  createKitchenContainer() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'kitchen-container';
      this.container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(135deg, #87CEEB 0%, #98FB98 100%);
        display: none;
        z-index: 1000;
      `;
      
      this.container.innerHTML = `
        <div style="position: absolute; top: 20px; left: 20px; color: white; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
          🍳 Level 2: Dapur Hemat Energi
        </div>
        
        <div style="position: absolute; top: 20px; right: 20px;">
          <button onclick="window.kitchenScene.hide()" style="
            padding: 10px 20px;
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid white;
            color: white;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            backdrop-filter: blur(10px);
          ">← Kembali</button>
        </div>
        
        <div style="position: absolute; top: 80px; left: 20px; background: rgba(0, 0, 0, 0.7); padding: 20px; border-radius: 15px; color: white; min-width: 300px;">
          <h3 style="margin-bottom: 15px; color: #4CAF50;">💡 Power Meter</h3>
          <div style="background: #333; height: 20px; border-radius: 10px; overflow: hidden; margin-bottom: 10px;">
            <div id="power-fill" style="
              height: 100%; 
              background: linear-gradient(90deg, #4CAF50, #8BC34A); 
              width: ${(this.gameState.totalPower / this.gameState.maxPower) * 100}%;
              transition: width 0.3s ease;
            "></div>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
            <span>Penggunaan: <span id="current-power">${this.gameState.totalPower}W</span></span>
            <span>Efisiensi: <span id="efficiency">${Math.round(this.gameState.efficiency * 100)}%</span></span>
          </div>
          <div style="font-size: 14px; color: #ccc;">
            Tujuan: Gunakan peralatan dengan efisien (≤ 200W)
          </div>
        </div>
        
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; max-width: 600px;">
          ${Object.entries(this.gameState.appliances).map(([name, data], index) => `
            <div class="appliance-card" data-appliance="${name}" style="
              background: rgba(255, 255, 255, 0.9);
              padding: 20px;
              border-radius: 15px;
              text-align: center;
              cursor: pointer;
              transition: all 0.3s ease;
              box-shadow: 0 4px 15px rgba(0,0,0,0.2);
              border: 3px solid ${data.active ? '#4CAF50' : '#ddd'};
            ">
              <div style="font-size: 48px; margin-bottom: 10px;">
                ${this.getApplianceIcon(name)}
              </div>
              <h3 style="margin-bottom: 10px; color: #333;">${this.getApplianceName(name)}</h3>
              <div style="font-size: 14px; color: #666; margin-bottom: 10px;">
                Daya: ${data.power}W | Efisiensi: ${Math.round(data.efficiency * 100)}%
              </div>
              <div style="
                padding: 8px 16px;
                background: ${data.active ? '#4CAF50' : '#f44336'};
                color: white;
                border-radius: 20px;
                font-weight: bold;
                font-size: 12px;
              ">
                ${data.active ? 'ON' : 'OFF'}
              </div>
            </div>
          `).join('')}
        </div>
        
        <div id="success-message" style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(76, 175, 80, 0.95);
          color: white;
          padding: 30px;
          border-radius: 20px;
          text-align: center;
          display: none;
          z-index: 1001;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        ">
          <div style="font-size: 48px; margin-bottom: 15px;">🎉</div>
          <h2 style="margin-bottom: 10px;">Selamat!</h2>
          <p style="margin-bottom: 20px;">Kamu berhasil mengoptimalkan efisiensi energi di dapur!</p>
          <button onclick="window.kitchenScene.completeLevel()" style="
            padding: 12px 24px;
            background: white;
            color: #4CAF50;
            border: none;
            border-radius: 25px;
            font-weight: bold;
            cursor: pointer;
          ">Lanjutkan</button>
        </div>
      `;
      
      document.body.appendChild(this.container);
    }
  }
  
  getApplianceIcon(name) {
    const icons = {
      fridge: '❄️',
      microwave: '🔥',
      riceCooker: '🍚',
      blender: '🥤',
      toaster: '🍞'
    };
    return icons[name] || '⚡';
  }
  
  getApplianceName(name) {
    const names = {
      fridge: 'Kulkas',
      microwave: 'Microwave',
      riceCooker: 'Rice Cooker',
      blender: 'Blender',
      toaster: 'Toaster'
    };
    return names[name] || name;
  }
  
  setupEventListeners() {
    // Event listeners will be added after container is created
    setTimeout(() => {
      document.querySelectorAll('.appliance-card').forEach(card => {
        card.addEventListener('click', (e) => {
          const appliance = e.currentTarget.dataset.appliance;
          this.toggleAppliance(appliance);
        });
      });
    }, 100);
  }
  
  toggleAppliance(name) {
    const appliance = this.gameState.appliances[name];
    appliance.active = !appliance.active;
    
    // Update power usage
    if (appliance.active) {
      this.gameState.totalPower += appliance.power;
    } else {
      this.gameState.totalPower -= appliance.power;
    }
    
    // Calculate efficiency
    this.calculateEfficiency();
    this.updateDisplay();
    this.checkCompletion();
    
    // Play sound
    if (window.audioManager) {
      window.audioManager.playClickSound();
    }
  }
  
  calculateEfficiency() {
    const activeAppliances = Object.values(this.gameState.appliances).filter(app => app.active);
    if (activeAppliances.length === 0) {
      this.gameState.efficiency = 0;
      return;
    }
    
    const totalEfficiency = activeAppliances.reduce((sum, app) => sum + app.efficiency, 0);
    this.gameState.efficiency = totalEfficiency / activeAppliances.length;
  }
  
  updateDisplay() {
    const powerFill = document.getElementById('power-fill');
    const currentPower = document.getElementById('current-power');
    const efficiency = document.getElementById('efficiency');
    
    if (powerFill) {
      const percentage = Math.min((this.gameState.totalPower / this.gameState.maxPower) * 100, 100);
      powerFill.style.width = `${percentage}%`;
      
      // Change color based on power usage
      if (this.gameState.totalPower > 200) {
        powerFill.style.background = 'linear-gradient(90deg, #f44336, #ff5722)';
      } else if (this.gameState.totalPower > 150) {
        powerFill.style.background = 'linear-gradient(90deg, #ff9800, #ffc107)';
      } else {
        powerFill.style.background = 'linear-gradient(90deg, #4CAF50, #8BC34A)';
      }
    }
    
    if (currentPower) {
      currentPower.textContent = `${this.gameState.totalPower}W`;
    }
    
    if (efficiency) {
      efficiency.textContent = `${Math.round(this.gameState.efficiency * 100)}%`;
    }
    
    // Update appliance cards
    document.querySelectorAll('.appliance-card').forEach(card => {
      const appliance = this.gameState.appliances[card.dataset.appliance];
      card.style.borderColor = appliance.active ? '#4CAF50' : '#ddd';
      const statusDiv = card.querySelector('div:last-child');
      if (statusDiv) {
        statusDiv.textContent = appliance.active ? 'ON' : 'OFF';
        statusDiv.style.background = appliance.active ? '#4CAF50' : '#f44336';
      }
    });
  }
  
  checkCompletion() {
    if (this.gameState.totalPower <= 200 && this.gameState.totalPower > 0 && !this.gameState.energyKeyCollected) {
      this.completeLevel();
    }
  }
  
  completeLevel() {
    this.gameState.energyKeyCollected = true;
    document.getElementById('success-message').style.display = 'block';
    
    // Award energy key
    if (window.gameState) {
      window.gameState.addEnergyKey();
    }
    
    // Play success sound
    if (window.audioManager) {
      window.audioManager.playSuccessSound();
    }
  }
  
  show() {
    this.container.style.display = 'block';
    this.updateDisplay();
  }
  
  hide() {
    this.container.style.display = 'none';
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KitchenScene;
} else {
  window.KitchenScene = KitchenScene;
}