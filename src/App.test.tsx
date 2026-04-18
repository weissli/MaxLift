// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import React, { act } from 'react';
import App, { DEFAULT_EXERCISES, CATEGORIES } from './App';

// Tell React we are in an act-compatible environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

function setInputValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

describe('App Constants', () => {
  it('should have the correct categories', () => {
    expect(CATEGORIES).toEqual(['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio', 'Other']);
  });

  it('should have DEFAULT_EXERCISES populated', () => {
    expect(DEFAULT_EXERCISES.length).toBeGreaterThan(0);
  });

  it('should contain the newly added exercises', () => {
    const trapBarDeadlift = DEFAULT_EXERCISES.find(e => e.name === 'Trap bar deadlift');
    expect(trapBarDeadlift).toBeTruthy();
    expect(trapBarDeadlift?.category).toBe('Legs');
    
    const dumbbellBenchPress = DEFAULT_EXERCISES.find(e => e.name === 'Dumbbell bench press');
    expect(dumbbellBenchPress).toBeTruthy();
    expect(dumbbellBenchPress?.category).toBe('Chest');
  });
  
  it('should have default values for all exercises', () => {
    DEFAULT_EXERCISES.forEach(exercise => {
      expect(exercise.currentWeight).toBe(0);
      expect(exercise.maxWeight).toBe(0);
      expect(exercise.history).toEqual([]);
      expect(exercise.date).toBeNull();
    });
  });
});

describe('App Behavior', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    
    // Mock localStorage
    const localStorageMock = (() => {
      let store: Record<string, string> = {};
      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value.toString(); },
        clear: () => { store = {}; },
        removeItem: (key: string) => { delete store[key]; }
      };
    })();
    vi.stubGlobal('localStorage', localStorageMock);

    // Mock matchMedia
    vi.stubGlobal('matchMedia', vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })));
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.unstubAllGlobals();
  });

  it('should add a new exercise', async () => {
    const root = createRoot(container);
    await act(async () => {
      root.render(<App />);
    });

    // Click add button
    const addBtn = container.querySelector('[data-testid="add-exercise-btn"]') as HTMLButtonElement;
    expect(addBtn).toBeTruthy();
    await act(async () => {
      addBtn.click();
    });

    // Fill in name
    const input = container.querySelector('[data-testid="exercise-name-input"]') as HTMLInputElement;
    expect(input).toBeTruthy();
    await act(async () => {
      setInputValue(input, 'New Test Exercise');
    });

    // Click create
    const createBtn = container.querySelector('[data-testid="create-exercise-btn"]') as HTMLButtonElement;
    expect(createBtn).toBeTruthy();
    await act(async () => {
      createBtn.click();
    });

    // Check if added
    const cards = container.querySelectorAll('[data-testid="exercise-card"]');
    const hasNewExercise = Array.from(cards).some(card => card.textContent?.includes('New Test Exercise'));
    expect(hasNewExercise).toBe(true);
  });

  it('should add entries to an exercise and check log', async () => {
    const root = createRoot(container);
    await act(async () => {
      root.render(<App />);
    });

    // Click on the first exercise card to open modal
    const card = container.querySelector('[data-testid="exercise-card"]') as HTMLDivElement;
    expect(card).toBeTruthy();
    await act(async () => {
      card.click();
    });

    // Enter weight
    const weightInput = container.querySelector('[data-testid="weight-input"]') as HTMLInputElement;
    expect(weightInput).toBeTruthy();
    await act(async () => {
      setInputValue(weightInput, '50');
    });

    // Save log
    const saveBtn = container.querySelector('[data-testid="save-log-btn"]') as HTMLButtonElement;
    await act(async () => {
      saveBtn.click();
    });

    // Re-open modal to add second entry (it closes on save)
    await act(async () => {
      card.click();
    });
    // Re-query elements as they were recreated
    const weightInput2 = container.querySelector('[data-testid="weight-input"]') as HTMLInputElement;
    const saveBtn2 = container.querySelector('[data-testid="save-log-btn"]') as HTMLButtonElement;

    // Enter another weight
    await act(async () => {
      setInputValue(weightInput2, '55');
    });

    // Save log
    await act(async () => {
      saveBtn2.click();
    });

    // Re-open modal to check history
    await act(async () => {
      card.click();
    });

    // Click View History
    const historyBtn = container.querySelector('[data-testid="view-history-btn"]') as HTMLButtonElement;
    await act(async () => {
      historyBtn.click();
    });

    // Check if log contains entries
    const modalContent = container.querySelector('.fixed.inset-0')?.textContent;
    expect(modalContent).toContain('50');
    expect(modalContent).toContain('55');
  });

  it('should delete an exercise', async () => {
    const root = createRoot(container);
    await act(async () => {
      root.render(<App />);
    });

    const initialCardsCount = container.querySelectorAll('[data-testid="exercise-card"]').length;

    // Click on the first exercise card
    const card = container.querySelector('[data-testid="exercise-card"]') as HTMLDivElement;
    await act(async () => {
      card.click();
    });

    // Click Delete in modal
    const deleteBtn = container.querySelector('[data-testid="delete-exercise-btn"]') as HTMLButtonElement;
    await act(async () => {
      deleteBtn.click();
    });

    // Click Confirm Delete in confirm modal
    const confirmBtn = container.querySelector('[data-testid="confirm-delete-btn"]') as HTMLButtonElement;
    await act(async () => {
      confirmBtn.click();
    });

    // Check if removed
    const finalCardsCount = container.querySelectorAll('[data-testid="exercise-card"]').length;
    expect(finalCardsCount).toBe(initialCardsCount - 1);
  });

  it('should show install banner when not standalone', async () => {
    vi.stubGlobal('matchMedia', vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })));

    const root = createRoot(container);
    await act(async () => {
      root.render(<App />);
    });

    const banner = container.querySelector('.fixed.top-0');
    expect(banner).toBeTruthy();
    expect(banner?.textContent).toContain('Install MaxLift');
  });

  it('should NOT show install banner when standalone', async () => {
    vi.stubGlobal('matchMedia', vi.fn().mockImplementation(query => ({
      matches: true, // Simulate standalone mode
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })));

    const root = createRoot(container);
    await act(async () => {
      root.render(<App />);
    });

    const banner = container.querySelector('.fixed.top-0');
    expect(banner).toBeFalsy();
  });
});
