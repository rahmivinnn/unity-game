// Bedroom Scene - Level 3: Smart Home Control
class BedroomScene {
  constructor() {
    this.container = document.getElementById('bedroom-container');
    this.gameState = {
      devices: {
        lights: { active: false, power: 60, smart: true },
        ac: { active: false, power: 1500, smart: true, temp: 24 },
        tv: { active: false, power: 200, smart: true },
        fan: { active: false, power: 50, smart: false },
        charger: { active: false, power: 25, smart: false }
      },
      totalPower: 0,
      maxPower: 1000,
      smartMode: false,
      energyKeyCollected: false,
      billAmount: 0
    };
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.updateDisplay();
    this.createBedroomContainer();
  }
  
  createBedroomContainer() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'bedroom-container';
      this.container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(135deg, #E6E6FA 0%, #DDA0DD 100%);
        display: none;
        z-index: 1000;
      `;
      
      this.container.innerHTML = `
        <div style="position: absolute; top: 20px; left: 20px; color: white; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
          🛏️ Level 3: Kamar Tidur Cerdas
        </div>
        
        <div style="position: absolute; top: 20px; right: 20px;">
          <button onclick="window.bedroomScene.hide()" style="
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
          <h3 style="margin-bottom: 15px; color: #9C27B0;">🏠 Smart Home Control</h3>
          <div style="background: #333; height: 20px; border-radius: 10px; overflow: hidden; margin-bottom: 10px;">
            <div id="power-fill" style="
              height: 100%; 
              background: linear-gradient(90deg, #9C27B0, #E91E63); 
              width: 0%;
              transition: width 0.3s ease;
            "></div>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
            <span>Penggunaan: <span id="current-power">${this.gameState.totalPower}W</span></span>
            <span>Tagihan: <span id="bill-amount">Rp ${this.gameState.billAmount.toLocaleString()}</span></span>
          </div>
          <div style="margin-bottom: 15px;">
            <label style="display: flex; align-items: center; cursor: pointer;">
              <input type="checkbox" id="smart-mode" style="margin-right: 10px;">
              <span>Smart Mode (Otomatis mati saat tidak digunakan)</span>
            </label>
          </div>
          <div style="font-size: 14px; color: #ccc;">
            Tujuan: Kelola perangkat dengan bijak (≤ 300W)
          </div>
        </div>
        
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; max-width: 500px;">
          ${Object.entries(this.gameState.devices).map(([name, data]) => `
            <div class="device-card" data-device="${name}" style="
              background: rgba(255, 255, 255, 0.9);
              padding: 20px;
              border-radius: 15px;
              text-align: center;
              cursor: pointer;
              transition: all 0.3s ease;
              box-shadow: 0 4px 15px rgba(0,0,0,0.2);
              border: 3px solid ${data.active ? '#9C27B0' : '#ddd'};
              position: relative;
            ">
              ${data.smart ? '<div style="position: absolute; top: 5px; right: 5px; font-size: 12px; color: #9C27B0;">🧠</div>' : ''}
              <div style="font-size: 48px; margin-bottom: 10px;">
                ${this.getDeviceIcon(name)}
              </div>
              <h3 style="margin-bottom: 10px; color: #333;">${this.getDeviceName(name)}</h3>
              <div style="font-size: 14px; color: #666; margin-bottom: 10px;">
                Daya: ${data.power}W
                ${name === 'ac' ? ` | Suhu: ${data.temp}°C` : ''}
              </div>
              <div style="
                padding: 8px 16px;
                background: ${data.active ? '#9C27B0' : '#f44336'};
                color: white;
                border-radius: 20px;
                font-weight: bold;
                font-size: 12px;
              ">
                ${data.active ? 'ON' : 'OFF'}
              </div>
              ${name === 'ac' ? `
                <div style="margin-top: 10px;">
                  <button onclick="event.stopPropagation(); window.bedroomScene.adjustTemp('${name}', -1)" style="
                    padding: 5px 10px;
                    background: #9C27B0;
                    color: white;
                    border: none;
                    border-radius: 15px;
                    cursor: pointer;
                    margin-right: 5px;
                  ">-</button>
                  <span id="temp-${name}">${data.temp}°C</span>
                  <button onclick="event.stopPropagation(); window.bedroomScene.adjustTemp('${name}', 1)" style="
                    padding: 5px 10px;
                    background: #9C27B0;
                    color: white;
                    border: none;
                    border-radius: 15px;
                    cursor: pointer;
                    margin-left: 5px;
                  ">+</button>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
        
        <div id="success-message" style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(156, 39, 176, 0.95);
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
          <p style="margin-bottom: 20px;">Kamu berhasil mengelola perangkat dengan bijak!</p>
          <button onclick="window.bedroomScene.completeLevel()" style="
            padding: 12px 24px;
            background: white;
            color: #9C27B0;
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
  
  getDeviceIcon(name) {
    const icons = {
      lights: '💡',
      ac: '❄️',
      tv: '📺',
      fan: '🌀',
      charger: '🔌'
    };
    return icons[name] || '⚡';
  }
  
  getDeviceName(name) {
    const names = {
      lights: 'Lampu',
      ac: 'AC',
      tv: 'TV',
      fan: 'Kipas',
      charger: 'Charger'
    };
    return names[name] || name;
  }
  
  setupEventListeners() {
    // Event listeners will be added after container is created
    setTimeout(() => {
      document.querySelectorAll('.device-card').forEach(card => {
        card.addEventListener('click', (e) => {
          const device = e.currentTarget.dataset.device;
          this.toggleDevice(device);
        });
      });
      
      document.getElementById('smart-mode').addEventListener('change', (e) => {
        this.gameState.smartMode = e.target.checked;
        this.updateDisplay();
      });
    }, 100);
  }
  
  toggleDevice(name) {
    const device = this.gameState.devices[name];
    device.active = !device.active;
    
    // Update power usage
    if (device.active) {
      this.gameState.totalPower += device.power;
    } else {
      this.gameState.totalPower -= device.power;
    }
    
    // Calculate bill
    this.calculateBill();
    this.updateDisplay();
    this.checkCompletion();
    
    // Play sound
    if (window.audioManager) {
      window.audioManager.playClickSound();
    }
  }
  
  adjustTemp(deviceName, delta) {
    const device = this.gameState.devices[deviceName];
    if (deviceName === 'ac') {
      device.temp = Math.max(16, Math.min(30, device.temp + delta));
      this.updateDisplay();
    }
  }
  
  calculateBill() {
    // Simplified bill calculation: 1W = Rp 1 per hour
    this.gameState.billAmount = Math.round(this.gameState.totalPower * 24 * 30); // Monthly
  }
  
  updateDisplay() {
    const powerFill = document.getElementById('power-fill');
    const currentPower = document.getElementById('current-power');
    const billAmount = document.getElementById('bill-amount');
    
    if (powerFill) {
      const percentage = Math.min((this.gameState.totalPower / this.gameState.maxPower) * 100, 100);
      powerFill.style.width = `${percentage}%`;
      
      // Change color based on power usage
      if (this.gameState.totalPower > 300) {
        powerFill.style.background = 'linear-gradient(90deg, #f44336, #ff5722)';
      } else if (this.gameState.totalPower > 200) {
        powerFill.style.background = 'linear-gradient(90deg, #ff9800, #ffc107)';
      } else {
        powerFill.style.background = 'linear-gradient(90deg, #9C27B0, #E91E63)';
      }
    }
    
    if (currentPower) {
      currentPower.textContent = `${this.gameState.totalPower}W`;
    }
    
    if (billAmount) {
      billAmount.textContent = `Rp ${this.gameState.billAmount.toLocaleString()}`;
    }
    
    // Update device cards
    document.querySelectorAll('.device-card').forEach(card => {
      const device = this.gameState.devices[card.dataset.device];
      card.style.borderColor = device.active ? '#9C27B0' : '#ddd';
      const statusDiv = card.querySelector('div:last-child');
      if (statusDiv && !statusDiv.innerHTML.includes('°C')) {
        statusDiv.textContent = device.active ? 'ON' : 'OFF';
        statusDiv.style.background = device.active ? '#9C27B0' : '#f44336';
      }
      
      // Update AC temperature display
      if (card.dataset.device === 'ac') {
        const tempSpan = card.querySelector(`#temp-${card.dataset.device}`);
        if (tempSpan) {
          tempSpan.textContent = `${device.temp}°C`;
        }
      }
    });
  }
  
  checkCompletion() {
    if (this.gameState.totalPower <= 300 && this.gameState.totalPower > 0 && !this.gameState.energyKeyCollected) {
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
  module.exports = BedroomScene;
} else {
  window.BedroomScene = BedroomScene;
}