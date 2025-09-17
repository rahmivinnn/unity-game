// In-Game Notification System
class InGameNotification {
    constructor() {
        this.createNotificationContainer();
        this.notifications = [];
    }

    createNotificationContainer() {
        // Remove existing container if any
        const existing = document.getElementById('game-notification-container');
        if (existing) {
            existing.remove();
        }

        // Create notification container
        const container = document.createElement('div');
        container.id = 'game-notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
            font-family: 'Arial', sans-serif;
        `;
        document.body.appendChild(container);
    }

    show(message, type = 'info', duration = 4000) {
        const notification = document.createElement('div');
        const notificationId = Date.now() + Math.random();
        
        // Notification styles based on type
        const styles = {
            info: {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: '2px solid #5a67d8',
                icon: '💡'
            },
            success: {
                background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
                border: '2px solid #48bb78',
                icon: '✅'
            },
            warning: {
                background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                border: '2px solid #ed8936',
                icon: '⚠️'
            },
            error: {
                background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                border: '2px solid #f56565',
                icon: '❌'
            },
            achievement: {
                background: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)',
                border: '2px solid #fdcb6e',
                icon: '🏆'
            }
        };

        const style = styles[type] || styles.info;

        notification.style.cssText = `
            background: ${style.background};
            border: ${style.border};
            border-radius: 12px;
            padding: 16px 20px;
            margin-bottom: 10px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            color: #2d3748;
            font-weight: 600;
            font-size: 14px;
            max-width: 350px;
            word-wrap: break-word;
            pointer-events: auto;
            cursor: pointer;
            transform: translateX(400px);
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            opacity: 0;
            position: relative;
            overflow: hidden;
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 20px; flex-shrink: 0;">${style.icon}</span>
                <span style="flex: 1; line-height: 1.4;">${message}</span>
                <span style="font-size: 18px; opacity: 0.7; cursor: pointer; padding: 2px 6px; border-radius: 4px; transition: background 0.2s;" onclick="this.parentElement.parentElement.remove()">×</span>
            </div>
            <div style="position: absolute; bottom: 0; left: 0; height: 3px; background: rgba(255,255,255,0.3); width: 100%; transform-origin: left; animation: notificationProgress ${duration}ms linear;"></div>
        `;

        // Add CSS animation for progress bar
        if (!document.getElementById('notification-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'notification-styles';
            styleSheet.textContent = `
                @keyframes notificationProgress {
                    from { transform: scaleX(1); }
                    to { transform: scaleX(0); }
                }
                
                .notification-shake {
                    animation: shake 0.5s ease-in-out;
                }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
            `;
            document.head.appendChild(styleSheet);
        }

        const container = document.getElementById('game-notification-container');
        container.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 100);

        // Click to dismiss
        notification.addEventListener('click', () => {
            this.removeNotification(notification);
        });

        // Auto remove after duration
        setTimeout(() => {
            this.removeNotification(notification);
        }, duration);

        this.notifications.push({ element: notification, id: notificationId });
        return notificationId;
    }

    removeNotification(notification) {
        if (notification && notification.parentElement) {
            notification.style.transform = 'translateX(400px)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 400);
        }
    }

    // Specific notification types
    info(message, duration = 4000) {
        return this.show(message, 'info', duration);
    }

    success(message, duration = 4000) {
        return this.show(message, 'success', duration);
    }

    warning(message, duration = 5000) {
        return this.show(message, 'warning', duration);
    }

    error(message, duration = 6000) {
        return this.show(message, 'error', duration);
    }

    achievement(message, duration = 6000) {
        return this.show(message, 'achievement', duration);
    }

    // Clear all notifications
    clearAll() {
        this.notifications.forEach(notif => {
            this.removeNotification(notif.element);
        });
        this.notifications = [];
    }
}

// Create global instance
window.gameNotification = new InGameNotification();

// Override browser alert, confirm, prompt
window.originalAlert = window.alert;
window.originalConfirm = window.confirm;
window.originalPrompt = window.prompt;

window.alert = function(message) {
    window.gameNotification.info(message);
};

window.confirm = function(message) {
    window.gameNotification.warning(message + '\n\n(Klik notifikasi untuk menutup)');
    return true; // Default to true for game flow
};

window.prompt = function(message, defaultText = '') {
    window.gameNotification.info(message);
    return defaultText; // Return default for game flow
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InGameNotification;
}