import { it, expect, describe} from 'vitest';
import { render, screen} from '@testing-library/react';
import { UserContext } from '../../src/UserContext';
import { BrowserRouter as Router } from 'react-router-dom'; // Mock routing
import Header from '../../src/components/Header';


describe('Header Component', () => {
    it('should render correctly when no user is logged in', () => {
      // Mock the user as null (no user logged in)
      render(
        <UserContext.Provider value={{ user: null }}>
          <Router>
            <Header />
          </Router>
        </UserContext.Provider>
      );
  
      // Check that the "airwnw" title and icon is present
      expect(screen.getByText(/airwnw/i)).toBeInTheDocument();
  
      // Check that the login link is present (since no user is logged in)
      const loginLink = screen.getByRole('login');
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute('href', '/login');
  
      // Check that the search button and input divs are present
      expect(screen.getByText(/Anywhere/i)).toBeInTheDocument();
      expect(screen.getByText(/Any week/i)).toBeInTheDocument();
      expect(screen.getByText(/Add guests/i)).toBeInTheDocument();
    });
  
    it('should render correctly when a user is logged in', () => {
      // Mock the user as an object (logged in)
      const mockUser = { name: 'John Doe', email: 'john@example.com' };
  
      render(
        <UserContext.Provider value={{ user: mockUser }}>
          <Router>
            <Header />
          </Router>
        </UserContext.Provider>
      );
  
      // Check that the user's name is displayed
      expect(screen.getByText('John Doe')).toBeInTheDocument();
  
      // Check that the profile link is present (since a user is logged in)
      const profileLink = screen.getByRole('login');
      expect(profileLink).toBeInTheDocument();
      expect(profileLink).toHaveAttribute('href', '/account/profile');
      const username = screen.getByText('John Doe');
      expect(username).toBeInTheDocument();
    });
  
    it('should render all elements and icons correctly', () => {
      render(
        <UserContext.Provider value={{ user: null }}>
          <Router>
            <Header />
          </Router>
        </UserContext.Provider>
      );
  
      // Check for the title link and icon
      const titleLink = screen.getByRole('link', { name: /airwnw/i });
      expect(titleLink).toBeInTheDocument();
      expect(titleLink).toHaveAttribute('href', '/');
  
      // Check for the search div containing the search criteria and button
      expect(screen.getByText('Anywhere')).toBeInTheDocument();
      expect(screen.getByText('Any week')).toBeInTheDocument();
      expect(screen.getByText('Add guests')).toBeInTheDocument();
  
      // Check the search button is rendered correctly
      const searchButton = screen.getByRole('button');
      expect(searchButton).toBeInTheDocument();
  
      // Check for the profile/login link at the end
      const menuIcon = screen.getByRole('menu-burger');
      const userIcon = screen.getByRole('user-profile');
  
      expect(menuIcon).toBeInTheDocument();
      expect(userIcon).toBeInTheDocument();
    });
  });