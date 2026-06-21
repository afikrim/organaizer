import type { Zone, Goal, Priority } from '@organaizer/types';
import heroImage from './hero.png';

export const mockZones: Zone[] = [
  {
    id: 'a1b2c3d4-e5f6-4a7b-8c9d-0123456789ab',
    number: 1,
    label: 'Cluttered Desk Area',
    priority: 'high',
    type: 'clutter',
    box: { x: 10, y: 35, width: 30, height: 25 },
    issue: 'Accumulation of loose papers and cables limits usable workspace.',
    suggestion: 'Clear loose papers into a folder and route cables under the desk.'
  },
  {
    id: 'b2c3d4e5-f6a7-4b8c-9d0e-123456789abc',
    number: 2,
    label: 'Floor Trip Hazard',
    priority: 'medium',
    type: 'unsafe_placement',
    box: { x: 45, y: 75, width: 20, height: 15 },
    issue: 'Power strip and cords in the main walkway.',
    suggestion: 'Route them along the baseboard or use a cable management box.'
  },
  {
    id: 'c3d4e5f6-a7b8-4c9d-8e1f-23456789abcd',
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

export const DEFAULT_IMAGE = heroImage;
