const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export default {
  async register(userData) {
    await delay();
    return { 
      data: { 
        user: { ...userData, id: Date.now(), role: 'user' },
        token: 'mock-jwt-token-' + Date.now()
      } 
    }
  },

  async login(credentials) {
    await delay();
    // Simulate admin login
    const role = credentials.email.includes('admin') ? 'admin' : 'user';
    return { 
      data: { 
        user: { 
          id: 1, 
          email: credentials.email, 
          name: credentials.email.split('@')[0], 
          role: role 
        },
        token: 'mock-jwt-token-' + Date.now()
      } 
    }
  },

  async verifyEmail(data) {
    await delay();
    return { data: { message: 'Email verified successfully' } }
  },

  async getProfile() {
    await delay();
    return { 
      data: { 
        user: { id: 1, email: 'user@example.com', name: 'Demo User', role: 'admin' }
      } 
    }
  },

  async resendOtp(email) { await delay(); return { data: {} } },
  async forgotPassword(email) { await delay(); return { data: {} } },
  async resetPassword(data) { await delay(); return { data: {} } }
}