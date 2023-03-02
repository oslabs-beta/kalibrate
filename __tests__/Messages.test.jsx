import React from 'react';
import {MemoryRouter, Route, Routes, Outlet} from 'react-router-dom';
import '@testing-library/jest-dom';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import userEvent from '@testing-library/user-event';
import {render, screen, fireEvent} from '@testing-library/react';
import MessagesDisplay from '../src/client/components/managePages/MessagesDisplay';

describe('MessagesDisplay Component', () => {
  // Api call to test topic returns array with a single mock message object
  const server = setupServer(
    rest.get('/api/test/messages', (req, res, ctx) => {
      return res(
        ctx.json([
          {
            key: 'key',
            value: 'value',
            partition: 'partition',
            offset: 'offset',
            timestamp: 'timestamp',
          },
        ])
      );
    })
  );

  // Setup & cleanup
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('Should load and display messages on mount', async () => {
    // Wrap MessagesDisplay component with Outlet context so it access to a topic for api call
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Outlet context={{selectedTopic: 'test'}} />}>
            <Route index element={<MessagesDisplay />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await screen.findByRole('grid'); // wait for MUI data grid to render

    expect(screen.getByRole('grid')).toBeInTheDocument(); // MUI data grid
    expect(screen.getAllByRole('row')).toHaveLength(2); // row header + 1 row from api call
  });

  it('Should load and display messages on refresh button click', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Outlet context={{selectedTopic: 'test'}} />}>
            <Route index element={<MessagesDisplay />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await screen.findByRole('grid');

    // After on mount call, update api route to send back 2 message objects
    server.use(
      rest.get('/api/test/messages', (req, res, ctx) => {
        return res(
          ctx.json([
            {
              key: 'key',
              value: 'value',
              partition: 'partition',
              offset: 'offset',
              timestamp: 'timestamp',
            },
            {
              key: 'key2',
              value: 'value2',
              partition: 'partition2',
              offset: 'offset2',
              timestamp: 'timestamp2',
            },
          ])
        );
      })
    );

    fireEvent.click(screen.getByText('Refresh')); // Refresh button fires a new api call

    await screen.findByRole('grid'); // wait for MUI data grid to render

    expect(screen.getByRole('grid')).toBeInTheDocument(); // MUI data grid
    expect(screen.getAllByRole('row')).toHaveLength(3); // row header + 2 rows from api call
  });
  it('Should display loading wheel while waiting for response', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Outlet context={{selectedTopic: 'test'}} />}>
            <Route index element={<MessagesDisplay />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await screen.findByRole('progressbar'); // wait for loading wheel to render

    expect(screen.getByRole('progressbar').toBeInTheDocument);
  });
  it('Should display error after a failed fetch', async () => {
    // Passing a topic that doesn't exist into the context
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Outlet context={{selectedTopic: 'error-test'}} />}>
            <Route index element={<MessagesDisplay />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await screen.findByRole('alert'); // wait for error message to render

    expect(screen.getByRole('alert').toBeInTheDocument);
  });
});

/* EXAMPLES */

// await userEvent.click(screen.getByText('Load Greeting'));
// await screen.findByRole('heading');

// expect(screen.getByRole('heading')).toHaveTextContent('hello there');
// expect(screen.getByRole('button')).toBeDisabled();

// test('handles server error', async () => {
//   server.use(
//     rest.get('/greeting', (req, res, ctx) => {
//       return res(ctx.status(500));
//     })
//   );

//   render(<Fetch url="/greeting" />);

//   fireEvent.click(screen.getByText('Load Greeting'));

//   await waitFor(() => screen.getByRole('alert'));

//   expect(screen.getByRole('alert')).toHaveTextContent('Oops, failed to fetch!');
//   expect(screen.getByRole('button')).not.toBeDisabled();
// });
