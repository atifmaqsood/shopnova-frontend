<template>
  <v-container class="notifications-container py-8">
    <!-- Page Header -->
    <div class="page-header mb-8">
      <div class="header-content">
        <div>
          <h1 class="page-title">Notifications</h1>
          <p class="page-subtitle">Stay updated with your latest activities</p>
        </div>
        <v-btn
          v-if="unreadCount > 0"
          text
          color="primary"
          @click="markAllRead"
          :loading="markingAll"
        >
          <v-icon left>mdi-check-all</v-icon>
          Mark all as read
        </v-btn>
      </div>
    </div>

    <v-row>
      <v-col cols="12" md="8" offset-md="2">
        <v-card class="notifications-card">
          <div v-if="loading" class="text-center py-8">
            <v-progress-circular indeterminate color="primary" />
          </div>

          <div v-else-if="notifications.length > 0" class="notifications-list">
            <div
              v-for="notification in notifications"
              :key="notification.id"
              class="notification-item"
              :class="{ 'unread': !notification.isRead }"
              @click="handleNotificationClick(notification)"
            >
              <div class="notification-icon">
                <v-icon :color="getNotificationColor(notification.type)">
                  {{ getNotificationIcon(notification.type) }}
                </v-icon>
              </div>
              
              <div class="notification-content">
                <div class="notification-header">
                  <h3 class="notification-title">{{ notification.title }}</h3>
                  <span class="notification-time">{{ formatTime(notification.createdAt) }}</span>
                </div>
                <p class="notification-message">{{ notification.message }}</p>
              </div>

              <div class="notification-actions">
                <v-btn
                  v-if="!notification.isRead"
                  icon
                  small
                  color="primary"
                  @click.stop="markRead(notification.id)"
                  title="Mark as read"
                >
                  <v-icon small>mdi-check</v-icon>
                </v-btn>
              </div>
            </div>
          </div>

          <div v-else class="empty-state">
            <v-icon size="80" color="#cbd5e1" class="mb-4">mdi-bell-off-outline</v-icon>
            <h3 class="empty-title">No notifications yet</h3>
            <p class="empty-text">We'll notify you when something important happens</p>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { formatDistanceToNow } from 'date-fns'

export default {
  name: 'Notifications',
  data() {
    return {
      markingAll: false
    }
  },
  computed: {
    ...mapGetters({
      notifications: 'notifications/notifications',
      unreadCount: 'notifications/unreadCount',
      loading: 'notifications/loading'
    })
  },
  created() {
    this.$store.dispatch('notifications/fetchNotifications')
  },
  methods: {
    formatTime(date) {
      return formatDistanceToNow(new Date(date), { addSuffix: true })
    },
    getNotificationIcon(type) {
      const icons = {
        ORDER_STATUS: 'mdi-package-variant',
        PAYMENT: 'mdi-credit-card',
        PROMOTION: 'mdi-tag',
        SYSTEM: 'mdi-information',
        DEFAULT: 'mdi-bell'
      }
      return icons[type] || icons.DEFAULT
    },
    getNotificationColor(type) {
      const colors = {
        ORDER_STATUS: 'primary',
        PAYMENT: 'success',
        PROMOTION: 'purple',
        SYSTEM: 'info',
        DEFAULT: 'grey'
      }
      return colors[type] || colors.DEFAULT
    },
    async markRead(id) {
      await this.$store.dispatch('notifications/markAsRead', id)
    },
    async markAllRead() {
      this.markingAll = true
      try {
        await this.$store.dispatch('notifications/markAllAsRead')
        this.$store.dispatch('ui/showSnackbar', {
          message: 'All notifications marked as read',
          color: 'success'
        })
      } finally {
        this.markingAll = false
      }
    },
    handleNotificationClick(notification) {
      if (!notification.isRead) {
        this.markRead(notification.id)
      }
      
      // Navigate based on notification type/data if needed
      if (notification.data?.orderId) {
        this.$router.push(`/orders/${notification.data.orderId}`)
      }
    }
  }
}
</script>

<style scoped>
.notifications-container {
  max-width: 1200px;
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-header {
  animation: slideDown 0.6s ease-out;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #64748b;
  font-weight: 500;
}

.notifications-card {
  border-radius: 20px !important;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
  background: white;
}

.notification-item {
  display: flex;
  padding: 20px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.notification-item:hover {
  background: #f8fafc;
}

.notification-item.unread {
  background: rgba(14, 165, 233, 0.05);
}

.notification-item.unread::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #0ea5e9 0%, #06b6d4 100%);
}

.notification-icon {
  margin-right: 16px;
  padding-top: 4px;
}

.notification-content {
  flex: 1;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.notification-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
}

.notification-time {
  font-size: 0.85rem;
  color: #94a3b8;
}

.notification-message {
  font-size: 0.95rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

.notification-actions {
  margin-left: 16px;
  display: flex;
  align-items: center;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.empty-text {
  color: #64748b;
}

@media (max-width: 600px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .page-title {
    font-size: 2rem;
  }
}
</style>
