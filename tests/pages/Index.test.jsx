import { it, expect, describe, beforeAll, afterEach, } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import IndexPage from '../../src/pages/IndexPage';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MemoryRouter } from 'react-router-dom';

describe('IndexPage', () => {
    let mock;
    beforeAll(() => {
        mock = new MockAdapter(axios);
    });

    afterEach(()=> {
        mock.reset();
    });

    it('should render places from the API', async() => {
        const mockPlaces = [
            {  
                _id: '1',
                address: 'Berlin',
                title: 'Schönes Apartment',
                price: 100,
                photos: [{ newName: 'photo1.jpg' }],
            },
            {
                _id: '2',
                address: 'Hamburg',
                title: 'Luxus Villa',
                price: 200,
                photos: [{ newName: 'photo2.jpg' }],
              },
        ];
        mock.onGet('/places').reply(200, mockPlaces);

        render(<MemoryRouter>
            <IndexPage />
        </MemoryRouter>);

    await waitFor(() => {
        expect(screen.getByText(/Berlin/i)).toBeInTheDocument();
        expect(screen.getByText(/Hamburg/i)).toBeInTheDocument();
    });

    await waitFor(() => {
        // Prüfen, ob Titel und Preise korrekt angezeigt werden
        expect(screen.getByText(/Schönes Apartment/i)).toBeInTheDocument();
        //expect(screen.getByText(/€\s?100\s?per night/i)).toBeInTheDocument(); // Flexible Match für Preis

        expect(screen.getByText(/Luxus Villa/i)).toBeInTheDocument();
       // expect(screen.getByText(/€\s?200\s?per night/i)).toBeInTheDocument(); // Flexible Match für Preis
      });

    const images = screen.getAllByAltText('img');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('src', 'http://localhost:4000/uploads/photo1.jpg');
    expect(images[1]).toHaveAttribute('src', 'http://localhost:4000/uploads/photo2.jpg');


    
    })
})