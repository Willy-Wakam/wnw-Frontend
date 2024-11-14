import { it, expect, describe, beforeAll, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MemoryRouter } from 'react-router-dom';
import RegisterPage from '../../src/pages/RegisterPage';
import userEvent from '@testing-library/user-event';
import { UserContext } from '../../src/UserContext';


describe('RegisterPage', () => {
    let spyAlert = vi.spyOn(window, 'alert').mockImplementation(vi.fn());
    let mock;
    const mockUsers = [
      {  
        _id: '1',
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: '012345678'
      },
      {
        _id: '2',
        name: 'Jane Doe',
        email: 'janedoe2@gmail.com',
        password: '123456789'
      },
    ];
  
    beforeAll(() => {
      mock = new MockAdapter(axios);
      // Mock für GET /users
      mock.onGet('/users').reply(200, mockUsers);
    });
  
    afterEach(() => {
      mock.reset();
      spyAlert.mockClear();
    });

    it('should reder a form with the inputs: usename, email, password, and repeat-passwort', () => {
        
        render(
            <MemoryRouter>
              <RegisterPage />
            </MemoryRouter>
          );
        
          expect(screen.getByRole('heading')).toBeInTheDocument();
          expect(screen.getByPlaceholderText(/your username/i)).toBeInTheDocument();
          expect(screen.getByPlaceholderText(/your@email.com/i)).toBeInTheDocument();
          expect(screen.getByPlaceholderText(/your username/i)).toBeInTheDocument();
          expect(screen.getByPlaceholderText(/repeat your password here/i)).toBeInTheDocument();
          expect(spyAlert).not.toHaveBeenCalled();
    })

    it('should display validation message if passwords do not match', async () => {
        render(
          <MemoryRouter>
            <RegisterPage />
          </MemoryRouter>
        );
    
        // E-Mail, Benutzername und verschiedene Passwörter eingeben
        await userEvent.type(screen.getByPlaceholderText(/your username/i), 'testuser');
        await userEvent.type(screen.getByPlaceholderText(/your@email.com/i), 'testuser@example.com');
        await userEvent.type(screen.getByPlaceholderText(/enter your password here/i), 'password123');
        await userEvent.type(screen.getByPlaceholderText(/repeat your password here/i), 'password124');
    
        // Registrierungsformular absenden
        await userEvent.click(screen.getByRole('button', { name: /register/i }));
    
        // Überprüfen, ob die Fehlermeldung "Passwords do not match" angezeigt wird
        expect(screen.getByRole('pass')).toBeInTheDocument();
        expect(screen.getByRole('repeat-pass')).toBeInTheDocument();
        expect(spyAlert).not.toHaveBeenCalled();
      });

      it('should display error if email is already registered', async () => {
        render(
            <UserContext.Provider value={{usersList: mockUsers}}>
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>
            </UserContext.Provider>
        );
        // E-Mail und Benutzername eingeben
        await userEvent.type(screen.getByPlaceholderText(/your username/i), 'johndoe');
        await userEvent.type(screen.getByPlaceholderText(/your@email.com/i), 'johndoe@gmail.com');
        await userEvent.type(screen.getByPlaceholderText(/enter your password here/i), 'password123');
        await userEvent.type(screen.getByPlaceholderText(/repeat your password here/i), 'password123');

        // Formular absenden
        await userEvent.click(screen.getByRole('button', { name: /register/i }));
    
        // Überprüfen, ob die Fehlermeldung "This email is already registered" angezeigt wird
        await waitFor(() => {
          expect(spyAlert).toHaveBeenCalledTimes(1);
          expect(spyAlert).toHaveBeenCalledWith('Please enter another E-mail');
        });
      });

      it('should handle registration failure', async () => {
        mock.onPost('/register').reply(500);

        render(<UserContext.Provider value={{usersList: mockUsers}}>
                <MemoryRouter>
                    <RegisterPage />
                </MemoryRouter>
                </UserContext.Provider>
            );
        
            // Simulate entering valid user details
            await userEvent.type(screen.getByPlaceholderText(/your username/i), 'testuser');
            await userEvent.type(screen.getByPlaceholderText(/your@email.com/i), 'testuser@example.com');
            await userEvent.type(screen.getByPlaceholderText(/enter your password here/i), 'password123');
            await userEvent.type(screen.getByPlaceholderText(/repeat your password here/i), 'password123');
        
            // Click the register button
            await userEvent.click(screen.getByRole('button', { name: /register/i }));
        
            // Wait for the form submission and error handling
            await waitFor(() => {
            // Ensure that alert is called with the correct message
            expect(spyAlert).toHaveBeenCalledTimes(1);
            expect(spyAlert).toHaveBeenCalledWith('Registration failed :(');
            });
          
      });

      it('should register successfully when valid details are provided', async () => {    
        // Mocking the /register POST request to return success
        mock.onPost('/register').reply(200, { data: {
            name: 'newuser',
            email: 'newuser@example.com',
            password: 'password123'
        } });

        render(
          <MemoryRouter>
            <RegisterPage />
          </MemoryRouter>
        );
    
        // Simulate user filling out the form
        await userEvent.type(screen.getByPlaceholderText(/your username/i), 'newuser');
        await userEvent.type(screen.getByPlaceholderText(/your@email.com/i), 'newuser@example.com');
        await userEvent.type(screen.getByPlaceholderText(/enter your password here/i), 'password123');
        await userEvent.type(screen.getByPlaceholderText(/repeat your password here/i), 'password123');
    
        // Simulate form submission
        await userEvent.click(screen.getByRole('button', { name: /register/i }));
    
        // Ensure that the registration was successful and a redirect happens
        await waitFor(() => {
          expect(mock.history.post.length).toBe(1);
          expect(mock.history.post[0].url).toBe('/register');
          expect(mock.history.post[0].data).toContain('newuser@example.com');
          expect(spyAlert).toBeCalledTimes(1);
          expect(spyAlert).toHaveBeenCalledWith('Registration was successful :). Try to login now')        
    });
        });
      ;
    
});
