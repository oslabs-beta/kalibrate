import jest from 'jest';
import React from 'react';
import {render, screen} from '@testing-library/react';
//import {Producer} from '../client/components/Producer.jsx.js';

describe('Producer', () => {
  it('that jest is working', () => {
    expect(true).toBe(true);
  });
});

// Create tests for Kafka producer clients

xdescribe('Producer', () => {
  it('Producer component renders to page', () => {
    render(<Producer />);
    expect(screen.getByText('Producer')).toBeInTheDocument();
    // screen.getByRole('button', {name: /submit/i})
  });
});

// test('Producer renders on page', () => {});
// test('Producer connects to Kafka cluster', () => {});
// test('Producer writes successfully to cluster', () => {});
