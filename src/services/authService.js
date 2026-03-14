const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const USERS_KEY = 'shopnova_users_list';
const CURRENT_USER_KEY = 'shopnova_current_user';

export default {
  async register(userData) {
    await delay();
    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    const newUser = { 
      ...userData, 
      id: Date.now(), 
      role: userData.email.includes('admin') ? 'ADMIN' : 'USER' 
    };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    const response = { 
      user: newUser,
      token: 'mock-jwt-token-' + Date.now()
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(response.user));
    return { data: response };
  },

  async login(credentials) {
    await delay();
    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    let user = users.find(u => u.email === credentials.email);
    
    if (!user) {
      // Create a default user if not found for demo purposes
      user = { 
        id: 1, 
        email: credentials.email, 
        name: credentials.email.split('@')[0], 
        role: credentials.email.includes('admin') ? 'ADMIN' : 'USER' 
      };
    }

    const response = { 
      user: user,
      token: 'mock-jwt-token-' + Date.now()
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(response.user));
    return { data: response };
  },

  async verifyEmail(data) {
    await delay();
    return { data: { message: 'Email verified successfully' } }
  },

  async getProfile() {
    await delay();
    const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    if (!user) throw new Error('Not authenticated');
    return { data: user };
  },

  async resendOtp(email) { await delay(); return { data: {} } },
  async forgotPassword(email) { await delay(); return { data: {} } },
  async resetPassword(data) { await delay(); return { data: {} } }
}