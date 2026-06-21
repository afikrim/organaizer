import type { Zone, Goal, Priority } from '@organaizer/types';

export const mockZones: Zone[] = [
  {
    id: 'm1',
    number: 1,
    label: 'Cluttered Desk Area',
    priority: 'high',
    type: 'clutter',
    box: { x: 10, y: 35, width: 30, height: 25 },
    issue: 'Accumulation of loose papers and cables limits usable workspace.',
    suggestion: 'Clear loose papers into a folder and route cables under the desk.'
  },
  {
    id: 'm2',
    number: 2,
    label: 'Floor Trip Hazard',
    priority: 'medium',
    type: 'unsafe_placement',
    box: { x: 45, y: 75, width: 20, height: 15 },
    issue: 'Power strip and cords in the main walkway.',
    suggestion: 'Route them along the baseboard or use a cable management box.'
  },
  {
    id: 'm3',
    number: 3,
    label: 'Overhead Shelf Risk',
    priority: 'low',
    type: 'unsafe_placement',
    box: { x: 60, y: 15, width: 25, height: 20 },
    issue: 'Heavy items placed near the edge of the shelf.',
    suggestion: 'Move heavy items to a lower shelf for safety.'
  }
];

export const mockChecklist = [
  { id: 'c1', text: 'Clear loose papers' },
  { id: 'c2', text: 'Route cables under desk' },
  { id: 'c3', text: 'Move power strip to baseboard' },
  { id: 'c4', text: 'Relocate heavy overhead items' }
];

export const GOALS: { id: Goal; label: string }[] = [
  { id: 'cleaner', label: 'Cleaner Space' },
  { id: 'safer', label: 'Safer Environment' },
  { id: 'storage', label: 'Better Storage' },
  { id: 'work', label: 'Work Focus' },
  { id: 'aesthetics', label: 'Aesthetics' }
];

export const PRIORITY_COLORS: Record<Priority, { bg: string, text: string, border: string }> = {
  high: { bg: 'bg-ruby/10', text: 'text-ruby', border: 'border-ruby' },
  medium: { bg: 'bg-lemon/10', text: 'text-lemon', border: 'border-lemon' },
  low: { bg: 'bg-primary-subdued/30', text: 'text-primary-deep', border: 'border-primary-subdued' },
};

export const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800';
