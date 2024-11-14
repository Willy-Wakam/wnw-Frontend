import { it, expect, describe, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { UserContext } from '../../src/UserContext';
import AccountPage from '../../src/pages/AccountPage';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

// Mock axios
vi.mock('axios');
vi.mock(import("react-router-dom"), async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    // your mocked methods
    Navigate: vi.fn(() => null),
  }
})

const mockUser = { name: 'John Doe', email: 'john@example.com' };

const renderWithContext = (user, ready) => {
  return render(
    <MemoryRouter initialEntries={['/account']}>
      <UserContext.Provider value={{ ready, user, setUser: vi.fn(), logout: false, setLogout: vi.fn() }}>
        <Routes>
          <Route path="/account" element={<AccountPage />} />
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </UserContext.Provider>
    </MemoryRouter>
  );
};

describe('AccountPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    renderWithContext(null, false); // User not set, not ready
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('redirects to login if user is not authenticated', async () => {
    renderWithContext(null, true); // User not set, ready
    expect(Navigate).toHaveBeenCalledWith({ to: '/login' }, {})
  });

  it('renders account details when user is authenticated', () => {
    renderWithContext(mockUser, true); // User is set, ready
    expect(screen.getByText(`Logged as ${mockUser.name} (${mockUser.email})`)).toBeInTheDocument();
  });

  it('logs out the user', async () => {
    const setUserMock = vi.fn();
    const setLogoutMock = vi.fn();
    const user = userEvent.setup();

    axios.post.mockResolvedValueOnce({}); // Mock axios logout response

    render(
      <MemoryRouter initialEntries={['/account']}>
        <UserContext.Provider value={{ ready: true, user: mockUser, setUser: setUserMock, logout: false, setLogout: setLogoutMock }}>
          <AccountPage />
        </UserContext.Provider>
      </MemoryRouter>
    );

    await user.click(screen.getByText('Logout'));
    
    await waitFor(() => {
      expect(setUserMock).toHaveBeenCalledWith(null);
      expect(setLogoutMock).toHaveBeenCalledWith(true);
      expect(axios.post).toHaveBeenCalledWith('/logout');
    });
  });

  it('redirects to home page after logout', async () => {
    const setUserMock = vi.fn();
    const setLogoutMock = vi.fn();
    const user = userEvent.setup();

    axios.post.mockResolvedValueOnce({}); // Mock axios logout response

    render(
      <MemoryRouter initialEntries={['/account']}>
        <UserContext.Provider value={{ ready: true, user: mockUser, setUser: setUserMock, logout: false, setLogout: setLogoutMock }}>
          <AccountPage />
        </UserContext.Provider>
      </MemoryRouter>
    );

    await user.click(screen.getByText('Logout'));

    await waitFor(() => { 
        expect(window.location.pathname).toBe('/');
    });
  });

  it('should redirect to Index Page when logout is true', async() => {
    const setUserMock = vi.fn();
    const setLogoutMock = vi.fn();

    axios.post.mockResolvedValueOnce({}); // Mock axios logout response

    render(
      <MemoryRouter initialEntries={['/account']}>
        <UserContext.Provider value={{ ready: true, user: mockUser, setUser: setUserMock, logout: true, setLogout: setLogoutMock }}>
          <AccountPage />
        </UserContext.Provider>
      </MemoryRouter>
    );

    expect(Navigate).toHaveBeenCalledWith({ to: '/' }, {})
  })
});
