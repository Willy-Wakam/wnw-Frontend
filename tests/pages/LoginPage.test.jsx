import { it, expect, describe, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import LoginPage from '../../src/pages/LoginPage';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import userEvent from '@testing-library/user-event';
import { UserContext } from '../../src/UserContext';

describe('LoginPage', () => {
    let spyAlert = vi.spyOn(window, 'alert').mockImplementation(vi.fn());
    let mockAxios;
    let mockSetUser = vi.fn();
    let mockSetLogout = vi.fn();

    beforeEach(() => {
        mockAxios = new MockAdapter(axios);
    });

    afterEach(() => {
        mockAxios.reset();
        mockSetUser.mockClear();
        mockSetLogout.mockClear();
        spyAlert.mockClear();
    });

    it('should render the login page', () => {
        render(<BrowserRouter>
            <LoginPage />
        </BrowserRouter>)

        const heading = screen.getByRole('heading');
        expect(heading).toBeInTheDocument();
        expect(screen.getByText(/don't have an account yet\?/i)).toBeInTheDocument();
    });

    it('should render a register Form containing an input for user-email ', () => {
        render(<BrowserRouter>
            <LoginPage />
        </BrowserRouter>);

        const placeholderUsername = screen.getByPlaceholderText('your@email.com');
        expect(placeholderUsername).toBeInTheDocument();
    });
        
    it('should render a register Form containing an input for user-password ', () => {
        render(<BrowserRouter>
            <LoginPage />
        </BrowserRouter>);

        const placeholderUsername = screen.getByPlaceholderText('Enter your password here');
        expect(placeholderUsername).toBeInTheDocument();
    });
    
    it('allows user to type in the email and password fields', async () => {
        render(
          <MemoryRouter>
            <LoginPage />
          </MemoryRouter>
        );

    
        const emailInput = screen.getByPlaceholderText(/your@email.com/i);
        const passwordInput = screen.getByPlaceholderText(/enter your password here/i);

        // Sicherstellen, dass die Felder im DOM vorhanden sind
        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
    
        // Simuliere das Eintippen von Daten
        await userEvent.type(emailInput, 'testuser@example.com');
        await  userEvent.type(passwordInput, 'password123');
    
        // Überprüfen, ob die Eingabefelder den neuen Wert enthalten
        expect(emailInput).toHaveValue('testuser@example.com');
        expect(passwordInput).toHaveValue('password123');
      });


      it('successful login redirects the user', async () => {
        const mockUser = { id: '123', name: 'Test User', email: 'testuser@example.com', password: 'password123'};
    
        // Mock erfolgreiche API Antwort
        mockAxios.onPost('/login').reply(200, { data: mockUser });
    
        render(
          <UserContext.Provider value={{ setUser: mockSetUser, setLogout: mockSetLogout }}>
            <MemoryRouter>
              <LoginPage />
            </MemoryRouter>
            </UserContext.Provider>
        );
    
        // Simuliere das Absenden des Formulars
        await userEvent.click(screen.getByRole('button'));
    
        // Warten auf den API-Aufruf und das Ergebnis
        await waitFor(() => {
            expect(mockSetUser).toHaveBeenCalled(1)
            expect(mockSetLogout).toHaveBeenCalledWith(false);
            expect(spyAlert).toHaveBeenCalled(1);
        });
    
        // Überprüfen, ob die Weiterleitung erfolgt
        expect(screen.queryByText(/login/i)).not.toBeInTheDocument(); // Login-Text sollte nach Redirect nicht mehr da sein
      });

      it('shows error when password is not correct', async () => {

        // Mock API Antwort für falsches Passwort
        mockAxios.onPost('/login').reply(200, { responseStatus: 'Password not Ok' });
    
        render(
          <UserContext.Provider value={{ setUser: mockSetUser, setLogout: mockSetLogout }}>
            <MemoryRouter>
              <LoginPage />
            </MemoryRouter>
          </UserContext.Provider>
        );
    
        // E-Mail- und Passwortfelder ausfüllen
        userEvent.type(screen.getByPlaceholderText(/your@email.com/i), 'testuser@example.com');
        userEvent.type(screen.getByPlaceholderText(/enter your password here/i), 'wrongpassword');
    
        // Simuliere das Absenden des Formulars
        userEvent.click(screen.getByRole('button'));
    
        // Warten auf die Anzeige der Fehlermeldung
        await waitFor(() => {
          expect(spyAlert).toHaveBeenCalled(1);
        });
    
        // Sicherstellen, dass setUser nicht aufgerufen wurde
        expect(mockSetUser).not.toHaveBeenCalled();
      });
    
      it('shows error message when API call fails (catch block)', async () => {        
        // Simuliere einen Fehler bei der API-Anfrage
        mockAxios.onPost('/login').reply(500);
    
        render(
          <UserContext.Provider value={{ setUser: mockSetUser, setLogout: mockSetLogout }}>
            <MemoryRouter>
              <LoginPage />
            </MemoryRouter>
          </UserContext.Provider>
        );
    

        // E-Mail- und Passwortfelder ausfüllen
        userEvent.type(screen.getByPlaceholderText(/your@email.com/i), 'testuser@example.com');
        userEvent.type(screen.getByPlaceholderText(/enter your password here/i), 'wrongpassword');
    
        // Simuliere das Absenden des Formulars
        userEvent.click(screen.getByRole('button'));
    
        // Warten auf die Anzeige der Fehlermeldung
        await waitFor(() => {
          expect(spyAlert).toHaveBeenCalled(1);
        });
    
        // Sicherstellen, dass setUser nicht aufgerufen wurde
        expect(mockSetUser).not.toHaveBeenCalled();
        expect(mockSetLogout).not.toHaveBeenCalled();
      });
   
})