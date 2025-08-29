// composables/useAuth.ts

export function useAuth() {
  const signup = async (userData: { name: string, email: string, password: string }) => {
    try {
      const { data } = await useFetch('/api/auth/signup', {
        method: 'POST',
        body: userData,
      })
      return data.value
    }
    catch (error) {
      console.error('Signup error:', error)
      return { success: false, message: 'Signup failed' }
    }
  }

  const login = async (credentials: { email: string, password: string }) => {
    try {
      const { data } = await useFetch('/api/auth/login', {
        method: 'POST',
        body: credentials,
      })
      return data.value
    }
    catch (error) {
      console.error('Login error:', error)
      return { success: false, message: 'Login failed' }
    }
  }

  const getProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const { data } = await useFetch('/api/auth/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return data.value
    }
    catch (error) {
      console.error('Get profile error:', error)
      return { success: false, message: 'Failed to get profile' }
    }
  }

  const updateProfile = async (updates: { name?: string, email?: string, password?: string }) => {
    try {
      const token = localStorage.getItem('token')
      const { data } = await useFetch('/api/auth/user', {
        method: 'PUT',
        body: updates,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return data.value
    }
    catch (error) {
      console.error('Update profile error:', error)
      return { success: false, message: 'Failed to update profile' }
    }
  }

  return {
    signup,
    login,
    getProfile,
    updateProfile,
  }
}
