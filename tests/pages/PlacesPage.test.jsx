import { it, expect, describe, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import PlacesPage from '../../src/pages/PlacesPage';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { UserContext } from '../../src/UserContext';


// Mock axios
vi.mock('axios');

const mockPlaces = [
  {
    _id: 'place1',
    title: 'Place 1',
    description: 'A wonderful place',
    photos: [{ newName: 'photo1.jpg' }],
  },
  {
    _id: 'place2',
    title: 'Place 2',
    description: 'Another wonderful place',
    photos: [{ newName: 'photo2.jpg' }],
  },
];

// Helper to render the component with MemoryRouter and dynamic routing
const renderWithRouter = (initialEntries = ['/account/places']) => {
  return render(
   <UserContext.Provider value={{ addedPlacesList: mockPlaces}} >
     <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/account/places" element={<PlacesPage />} />
        <Route path="/account/places/new" element={<div>New Place Page</div>} />
        <Route path="/account/places/:id" element={<div>Place Detail Page</div>} />
      </Routes>
    </MemoryRouter>
   </UserContext.Provider>
  );
};

describe('PlacesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the page and fetches places from the API', async () => {
    axios.get.mockResolvedValueOnce({ data: mockPlaces });

    renderWithRouter(); // Render the component

    // Verify the "Add new place" button is displayed
    expect(screen.getByText('Add new place')).toBeInTheDocument();

    // Wait for the places to be fetched and rendered
    await waitFor(() => {
      // Check that the places are rendered
      expect(screen.getByText('Place 1')).toBeInTheDocument();
      expect(screen.getByText('A wonderful place')).toBeInTheDocument();
      expect(screen.getByText('Place 2')).toBeInTheDocument();
      expect(screen.getByText('Another wonderful place')).toBeInTheDocument();
    });
  });

  it('shows the "Add new place" button when action is not "new"', () => {
    renderWithRouter(['/account/places']);

    // Check if the "Add new place" button is visible
    expect(screen.getByText('Add new place')).toBeInTheDocument();
  });

  it('navigates to the new place page when the "Add new place" button is clicked', async () => {
    const user = userEvent.setup();

    renderWithRouter(['/account/places']); // Render the page

    // Click on the "Add new place" button
    await user.click(screen.getByText('Add new place'));

    // Check if the navigation to the new place page happened
    await waitFor(() => {
      expect(screen.getByText('New Place Page')).toBeInTheDocument();
    });
  });

  it('navigates to the detail page of a specific place when clicked', async () => {
    axios.get.mockResolvedValueOnce({ data: mockPlaces });
    const user = userEvent.setup();

    renderWithRouter(['/account/places']); // Render the page

    // Wait for places to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByText('Place 1')).toBeInTheDocument();
    });

    // Click on the first place link
    await user.click(screen.getByText('Place 1'));

    // Check if the navigation to the place detail page happened
    await waitFor(() => {
      expect(screen.getByText('Place Detail Page')).toBeInTheDocument();
    });
  });

  it('shows no places if the API returns an empty list', async () => {
    render(
      <UserContext.Provider value={{ addedPlacesList: []}} >
        <MemoryRouter initialEntries={['/account/places']}>
         <Routes>
           <Route path="/account/places" element={<PlacesPage />} />
           <Route path="/account/places/new" element={<div>New Place Page</div>} />
           <Route path="/account/places/:id" element={<div>Place Detail Page</div>} />
         </Routes>
       </MemoryRouter>
      </UserContext.Provider>
     ); // Render the page

    // Wait for places to be fetched and check that no places are rendered
    await waitFor(() => {
      expect(screen.queryByText('Place 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Place 2')).not.toBeInTheDocument();
    });

    // You could also check that there's a message or element indicating no places exist
    // For example, check that some "no places" message is shown.
    expect(screen.getByText('List of all added places')).toBeInTheDocument();
  });
});