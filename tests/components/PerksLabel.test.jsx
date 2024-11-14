import { it, expect, describe, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PerksLabel from '../../src/components/PerksLabel';

describe('PerksLabel Component', () => {
    const perksList = ['Wifi', 'Parking', 'TV', 'Pets', 'Kitchen'];
    let mockOnChange;
  
    beforeEach(() => {
      // Mock the onChange function
      mockOnChange = vi.fn();
    });
  
    it('should render all perks with checkboxes', () => {
      render(<PerksLabel selected={[]} onChange={mockOnChange} perksList={perksList}/>);
  
      // Check that all perks are rendered with their labels
      perksList.forEach((perk) => {
        const checkboxLabel = screen.getByRole(perk);
        expect(checkboxLabel).toBeInTheDocument();
        expect(checkboxLabel.checked).toBe(false); // Check the label text
      });
    });
  
    it('should check the boxes based on the selected perks', () => {
      const selectedPerks = ['Wifi', 'TV'];
  
      render(<PerksLabel selected={selectedPerks} onChange={mockOnChange} perksList={perksList}/>);
  
      // Check that the correct checkboxes are checked
      selectedPerks.forEach((perk) => {
        const checkbox = screen.getByRole(perk); // Find the checkbox by label
        expect(checkbox).toBeChecked();
      });
  
      // Check that the other checkboxes are not checked
      const unselectedPerks = perksList.filter(perk => !selectedPerks.includes(perk));
      unselectedPerks.forEach((perk) => {
        const checkbox = screen.getByRole(perk);
        expect(checkbox).not.toBeChecked();
      });
    });
  
    it('should call onChange with the correct perks when a checkbox is clicked', async () => {
      const user = userEvent.setup();
      const selectedPerks = ['Wifi', 'Parking'];
  
      render(<PerksLabel selected={selectedPerks} onChange={mockOnChange} perksList={perksList}/>);
  
      // Click the checkbox for 'TV' to add it to the selected perks
      const tvCheckbox = screen.getByRole('TV');
      await user.click(tvCheckbox);
  
      // Verify that onChange is called with the updated list of selected perks
      expect(mockOnChange).toHaveBeenCalledWith([...selectedPerks, 'TV']);
  
      // Click the checkbox for 'Wifi' to remove it from the selected perks
      const wifiCheckbox = screen.getByRole('Wifi');
      await user.click(wifiCheckbox);
  
      // Verify that onChange is called with the updated list of selected perks
      expect(mockOnChange).toHaveBeenCalledWith(['Parking']);
    });
  
    it('should toggle the checkbox correctly when clicked multiple times', async () => {
      const user = userEvent.setup();
      const selectedPerks = ['Pets'];
  
      render(<PerksLabel selected={selectedPerks} onChange={mockOnChange} perksList={perksList}/>);
  
      // Initially, Pets checkbox should be checked
      const petsCheckbox = screen.getByRole('Pets');
      expect(petsCheckbox).toBeChecked();

  
      // Click the checkbox to uncheck it
      await user.click(petsCheckbox);
      expect(mockOnChange).toHaveBeenCalledWith([]); // Pets should be removed
  
      // Click the checkbox again to check it
      await user.click(petsCheckbox);
      expect(mockOnChange).toHaveBeenCalled(); // Pets should be added back
    });
  });
