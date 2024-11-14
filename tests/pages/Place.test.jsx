import { it, expect, describe, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fireEvent } from '@testing-library/react';
import PlacePage from '../../src/pages/PlacePage';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../src/UserContext';
import { Navigate } from 'react-router-dom';

// Mock axios for both get and post requests
vi.mock('axios');
vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
  Navigate: vi.fn(() => null),
}));

vi.mock('../../src/components/DropDown', () => ({
  default: ({ guestsNumber, nbGuests, setNbGuests }) => (
    <select
      data-testid="guest-dropdown"
      value={nbGuests}
      onChange={(e) => setNbGuests(Number(e.target.value))}
    >
      {[...Array(guestsNumber)].map((_, i) => (
        <option key={i} value={i + 1}>
          {i + 1}
        </option>
      ))}
    </select>
  ),
}));

describe('PlacePage Component', () => {
  beforeEach(() => {
    // Mock the useParams to simulate route parameter
    useParams.mockReturnValue({ id: '1' });

    // Mock axios.get to return a mock place object
    axios.get.mockResolvedValue({
      data: {
        _id: '1',
        title: 'Test Place',
        address: '123 Main St, Test City',
        photos: [{ newName: 'photo1.jpg' }, { newName: 'photo2.jpg' }, { newName: 'photo3.jpg' }, { newName: 'photo4.jpg' }],
        description: 'A beautiful test place.',
        price: 100,
        maxGuests: 4,
        checkIn: '12:00 PM',
        checkOut: '11:00 AM',
        extraInfo: 'Some extra information.',
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks(); // Clear mocks after each test
  });

  it('renders place page with place data', async () => {
    render(
      <UserContext.Provider value={{ user: { name: 'John Doe', email: 'john@example.com' } }}>
        <PlacePage />
      </UserContext.Provider>
    );
    
    
    // Assert the place title, address and description are displayed after the data loads
    await waitFor(() => expect(screen.getByText('Test Place')).toBeInTheDocument());
    expect(screen.getByText('123 Main St, Test City')).toBeInTheDocument();
    expect(screen.getByText('A beautiful test place.')).toBeInTheDocument();
  });

  it('renders and interacts with date inputs and guest dropdown', async () => {
    const user = userEvent.setup();

    render(
      <UserContext.Provider value={{ user: { name: 'John Doe', email: 'john@example.com' } }}>
        <PlacePage />
      </UserContext.Provider>
    );
    
    // Wait for data to load
    await waitFor(() => expect(screen.getByText('Test Place')).toBeInTheDocument());

    // Change check-in and check-out dates
    const checkInInput = screen.getByRole('checkin');
    const checkOutInput = screen.getByRole('checkout');

    await user.type(checkInInput, '2024-09-28');
    await user.type(checkOutInput, '2024-09-30');

    expect(checkInInput).toHaveValue('2024-09-28');
    expect(checkOutInput).toHaveValue('2024-09-30');

    // Select number of guests using the mocked dropdown
    const guestDropdown = screen.getByTestId('guest-dropdown');
    await user.selectOptions(guestDropdown, '3');
    
    expect(guestDropdown).toHaveValue('3');
  });

  it('handles booking submission', async () => {
    const user = userEvent.setup();
    const mockPost = axios.post.mockResolvedValue({ status: 200 });

    render(
      <UserContext.Provider value={{ user: { name: 'John Doe', email: 'john@example.com' } }}>
        <PlacePage />
      </UserContext.Provider>
    );
    // Wait for data to load
    await waitFor(() => expect(screen.getByText('Test Place')).toBeInTheDocument());

    // Fill out the form
    await user.type(screen.getByRole('checkin'), '2024-09-28');
    await user.type(screen.getByRole('checkout'), '2024-09-30');
    await user.selectOptions(screen.getByTestId('guest-dropdown'), '2');
    await user.clear(screen.getByPlaceholderText('name and surname'));
    await user.type(screen.getByPlaceholderText('name and surname'), 'John Doe');
    await user.type(screen.getByPlaceholderText('your@mail.com'), 'john@example.com');
    await user.clear(screen.getByPlaceholderText('your phone number'));
    await user.type(screen.getByPlaceholderText('your phone number'), '123456789');

    // Click the book now button
    const bookNowButton = screen.getByText(/book now/i);
    await user.click(bookNowButton);

    // Expect axios post to be called with correct booking data
    await waitFor(() =>
      expect(mockPost).toHaveBeenCalledWith('/bookings', {
        place: '1',
        checkIn: new Date('2024-09-28'),
        checkOut: new Date('2024-09-30'),
        name: 'John Doe',
        phone: '123456789',
        price: 200, // 2 nights * 100 price per night
        numberOfGuests: 2,
        mail: 'john@example.com',
      })
    );

    // Expect the user to be redirected after a successful booking
    await waitFor(() => expect(Navigate).toHaveBeenCalledWith({ to: '/account/bookings/all' }, {}));
  });

  it('should render the container for showing all photos', async () => {
    const user = userEvent.setup();

    const mockPlaceData = {
        _id: '1',
        title: 'Test Place',
        address: '123 Main St, Test City',
        photos: [{ newName: 'photo1.jpg' }, { newName: 'photo2.jpg' }, { newName: 'photo3.jpg' }, { newName: 'photo4.jpg' }],
        description: 'A beautiful test place.',
        price: 100,
        maxGuests: 4,
        checkIn: '12:00 PM',
        checkOut: '11:00 AM',
        extraInfo: 'Some extra information.',
      };

    render(
      <UserContext.Provider value={{ user: { name: 'John Doe', email: 'john@example.com' } }}>
        <PlacePage />
      </UserContext.Provider>
    );
    
     // Wait for data to load
     await waitFor(() => expect(screen.getByText('Test Place')).toBeInTheDocument());

     // Change check-in and check-out dates
     const checkInInput = screen.getByRole('checkin');
     const checkOutInput = screen.getByRole('checkout');
     const showBtn = screen.getByRole('button', {name: 'Show more photos'});

     await user.type(checkInInput, '2024-09-28');
     await user.type(checkOutInput, '2024-09-30');
 
     expect(checkInInput).toHaveValue('2024-09-28');
     expect(checkOutInput).toHaveValue('2024-09-30');
 
     // Select number of guests using the mocked dropdown
     const guestDropdown = screen.getByTestId('guest-dropdown');
     await user.selectOptions(guestDropdown, '3');
     expect(guestDropdown).toHaveValue('3');
     await user.click(showBtn);
     await waitFor(() => 
        expect(screen.getByRole('heading', {name: 'Photos of Test Place'})),
        expect(screen.getAllByRole('img')).toHaveLength(mockPlaceData.photos?.length)
    );
  });

  it('triggers setAllPhotos when clicking on a photo', async () => {
    const user = userEvent.setup();
    render(
        <UserContext.Provider value={{ user: { name: 'John Doe', email: 'john@example.com' } }}>
          <PlacePage />
        </UserContext.Provider>
      );
      
    // Wait for data to load
    await waitFor(() => expect(screen.getByText('Test Place')).toBeInTheDocument());

    // Change check-in and check-out dates
    const checkInInput = screen.getByRole('checkin');
    const checkOutInput = screen.getByRole('checkout');

    await user.type(checkInInput, '2024-09-28');
    await user.type(checkOutInput, '2024-09-30');

    expect(checkInInput).toHaveValue('2024-09-28');
    expect(checkOutInput).toHaveValue('2024-09-30');

    // Select number of guests using the mocked dropdown
    const guestDropdown = screen.getByTestId('guest-dropdown');
    await user.selectOptions(guestDropdown, '3');
    expect(guestDropdown).toHaveValue('3');

    // Click on the first photo
    const firstPhoto = screen.getAllByAltText('img')[0];
    fireEvent.click(firstPhoto);
    // Assert that the "Photos of" heading is displayed, indicating setAllPhotos(true) was triggered
    expect(screen.getByText(/photos of test place/i)).toBeInTheDocument();

    // Back to the Place page
    const deleteBtn = screen.getByRole('delete');
    await user.click(deleteBtn);
    await waitFor(() => expect(screen.getByText('Test Place')).toBeInTheDocument());

    // Click on the second photo
    const secondPhoto = screen.getAllByAltText('img')[1];
    fireEvent.click(secondPhoto);
    // Assert that the "Photos of" heading is displayed, indicating setAllPhotos(true) was triggered
    expect(screen.getByText(/photos of test place/i)).toBeInTheDocument();

    // Back to the Place page
    const deleteBtn2 = screen.getByRole('delete');
    await user.click(deleteBtn2);
    await waitFor(() => expect(screen.getByText('Test Place')).toBeInTheDocument());

    // Click on the third photo
    const thirdPhoto = screen.getAllByAltText('img')[2];
    fireEvent.click(thirdPhoto);
    // Assert that the "Photos of" heading is displayed, indicating setAllPhotos(true) was triggered
    expect(screen.getByText(/photos of test place/i)).toBeInTheDocument();

    // Back to the Place page
    const deleteBtn3 = screen.getByRole('delete');
    await user.click(deleteBtn3);
    await waitFor(() => expect(screen.getByText('Test Place')).toBeInTheDocument());

    // Click on the fourth photo
    const fourthPhoto = screen.getAllByAltText('img')[3];
    fireEvent.click(fourthPhoto);
    // Assert that the "Photos of" heading is displayed, indicating setAllPhotos(true) was triggered
    expect(screen.getByText(/photos of test place/i)).toBeInTheDocument();
  });

  it('triggers setName when typing into the name input field', async () => {
    const user = userEvent.setup();

    render(
      <UserContext.Provider value={{ user: { name: 'John Doe', email: 'john@example.com' } }}>
        <PlacePage />
      </UserContext.Provider>
    );

    // Wait for the data to load
    await waitFor(() => expect(screen.getByText('Test Place')).toBeInTheDocument());

    // Change check-in and check-out dates
    const checkInInput = screen.getByRole('checkin');
    const checkOutInput = screen.getByRole('checkout');

    await user.type(checkInInput, '2024-09-28');
    await user.type(checkOutInput, '2024-09-30');

    expect(checkInInput).toHaveValue('2024-09-28');
    expect(checkOutInput).toHaveValue('2024-09-30');

    // Simulate typing into the name input field
    const nameInput = screen.getByPlaceholderText('name and surname');
    await user.clear(nameInput);
    await user.type(nameInput, 'Jane Doe');

    // Assert that the value in the input is updated
    expect(nameInput).toHaveValue('Jane Doe');
  });

  it('should render place page after closing the container which shows all photos', async () => {
    const user = userEvent.setup();

    const mockPlaceData = {
        _id: '1',
        title: 'Test Place',
        address: '123 Main St, Test City',
        photos: [{ newName: 'photo1.jpg' }, { newName: 'photo2.jpg' }, { newName: 'photo3.jpg' }, { newName: 'photo4.jpg' }],
        description: 'A beautiful test place.',
        price: 100,
        maxGuests: 4,
        checkIn: '12:00 PM',
        checkOut: '11:00 AM',
        extraInfo: 'Some extra information.',
      };

    render(
      <UserContext.Provider value={{ user: { name: 'John Doe', email: 'john@example.com' } }}>
        <PlacePage />
      </UserContext.Provider>
    );
    
     // Wait for data to load
     await waitFor(() => expect(screen.getByText('Test Place')).toBeInTheDocument());

     // Change check-in and check-out dates
     const checkInInput = screen.getByRole('checkin');
     const checkOutInput = screen.getByRole('checkout');
     const showBtn = screen.getByRole('button', {name: 'Show more photos'});

     await user.type(checkInInput, '2024-09-28');
     await user.type(checkOutInput, '2024-09-30');
 
     expect(checkInInput).toHaveValue('2024-09-28');
     expect(checkOutInput).toHaveValue('2024-09-30');
 
     // Select number of guests using the mocked dropdown
     const guestDropdown = screen.getByTestId('guest-dropdown');
     await user.selectOptions(guestDropdown, '3');
     expect(guestDropdown).toHaveValue('3');
     await user.click(showBtn);
     await waitFor(() => 
        expect(screen.getByRole('heading', {name: 'Photos of Test Place'})),
        expect(screen.getAllByRole('img')).toHaveLength(mockPlaceData.photos?.length)
    );
    const deleteBtn = screen.getByRole('delete');
    await user.click(deleteBtn);
    await waitFor(() => expect(screen.getByText('Test Place')).toBeInTheDocument());
  });
});
