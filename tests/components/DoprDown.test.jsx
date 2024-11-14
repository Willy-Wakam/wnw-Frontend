/* eslint-disable react/prop-types */
import { it, expect, describe, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DropDown from '../../src/components/DropDown';

// Mocking Material Tailwind's Menu components
vi.mock('@material-tailwind/react', () => ({
    Menu: ({ children }) => <div>{children}</div>,
    MenuHandler: ({ children }) => <div>{children}</div>,
    MenuList: ({ children }) => <div>{children}</div>,
    MenuItem: ({ children, onClick }) => <div onClick={onClick}>{children}</div>,
  }));
let setNbGuests = vi.fn();

  describe('DropDown Component', () => {
    it('renders the dropdown button with initial number of guests', () => {
      render(<DropDown guestsNumber={5} nbGuests={1} setNbGuests={setNbGuests} />);
  
      // Check if the button with the initial number of guests is rendered
      expect(screen.getByRole('button'), {name: '1'}).toBeInTheDocument(); // Initial guest number is 1
    });
  
    it('renders the correct number of guest options when the dropdown is clicked', async () => {
      const user = userEvent.setup();
      render(<DropDown guestsNumber={5} nbGuests={1} setNbGuests={setNbGuests} />);
  
      // Click the dropdown button to show the menu
      const button = screen.getByRole('button');
      await user.click(button);
  
      // Check if the correct number of guest options (5 options) is rendered
      expect(screen.getAllByText('1')).toHaveLength(2);
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();

      await user.click(screen.getByText('4'));
      expect(setNbGuests).toHaveBeenCalledWith(4)

    });

})