import io from 'socket.io-client'
import store from '../store'

class SocketService {
    constructor() {
        this.socket = null
        this.connected = false
    }

    connect(token) {
        if (this.socket && this.connected) {
            return
        }

        const apiUrl = process.env.VUE_APP_API_URL || 'http://localhost:3000'

        this.socket = io(apiUrl, {
            auth: {
                token
            },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5
        })

        this.socket.on('connect', () => {
            console.log('✅ Socket.IO connected')
            this.connected = true
        })

        this.socket.on('disconnect', () => {
            console.log('❌ Socket.IO disconnected')
            this.connected = false
        })

        this.socket.on('connect_error', (error) => {
            console.error('Socket.IO connection error:', error.message)
        })

        // Listen for notifications
        this.socket.on('notification', (notification) => {
            console.log('📬 New notification received:', notification)
            store.dispatch('notifications/addNotification', notification)

            // Show snackbar for new notification
            store.dispatch('ui/showSnackbar', {
                message: notification.message || 'You have a new notification',
                color: 'info'
            })
        })

        // Listen for order updates
        this.socket.on('orderUpdate', (data) => {
            console.log('📦 Order update received:', data)
            store.dispatch('ui/showSnackbar', {
                message: `Order #${data.orderId} status updated to ${data.status}`,
                color: 'success'
            })
        })

        return this.socket
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect()
            this.socket = null
            this.connected = false
            console.log('Socket.IO disconnected manually')
        }
    }

    emit(event, data) {
        if (this.socket && this.connected) {
            this.socket.emit(event, data)
        } else {
            console.warn('Socket not connected. Cannot emit event:', event)
        }
    }

    on(event, callback) {
        if (this.socket) {
            this.socket.on(event, callback)
        }
    }

    off(event, callback) {
        if (this.socket) {
            this.socket.off(event, callback)
        }
    }
}

export default new SocketService()
