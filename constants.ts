
import { MoodConfig, SlideData } from './types';

export const MOODS: MoodConfig[] = [
  {
    name: 'cyberpunk',
    label: 'Cyberpunk',
    promptPrefix: 'cyberpunk city neon night futuristic',
    accentColor: '#f43f5e'
  },
  {
    name: 'nature',
    label: 'Nature',
    promptPrefix: 'enchanted forest mystical waterfall mountain',
    accentColor: '#10b981'
  },
  {
    name: 'fantasy',
    label: 'Dark Fantasy',
    promptPrefix: 'gothic castle dark fantasy epic landscape',
    accentColor: '#8b5cf6'
  },
  {
    name: 'space',
    label: 'Cosmic',
    promptPrefix: 'galaxy nebula outer space stars planet',
    accentColor: '#3b82f6'
  },
  {
    name: 'minimal',
    label: 'Zen',
    promptPrefix: 'minimalist architecture zen garden peaceful sunset',
    accentColor: '#f59e0b'
  }
];

export const INITIAL_SLIDES: SlideData[] = [
  {
    id: '1',
    imageUrl: 'https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    title: 'THE WILD',
    subtitle: 'NATURE',
    description: 'Explore the depths of the untamed wilderness where nature reigns supreme. Experience the world in its purest, most raw form through high-definition photography.',
    mood: 'nature'
  },
  {
    id: '2',
    imageUrl: 'https://images.pexels.com/photos/2525903/pexels-photo-2525903.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    title: 'LOST CITY',
    subtitle: 'EXPLORE',
    description: 'Ancient ruins hidden deep within the mist of time, waiting for the bold to uncover their forgotten secrets and golden treasures.',
    mood: 'nature'
  },
  {
    id: '3',
    imageUrl: 'https://images.pexels.com/photos/14350712/pexels-photo-14350712.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    title: 'NEON EDGE',
    subtitle: 'FUTURE',
    description: 'When the sun sets, the city of tomorrow wakes up in a blaze of neon and shadow. A world where tech and humanity collide.',
    mood: 'cyberpunk'
  },
  {
    id: '4',
    imageUrl: 'https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    title: 'DEEP BLUE',
    subtitle: 'OCEAN',
    description: 'Beneath the surface lies a quiet world of immense pressure and unparalleled beauty. The final frontier of our own planet.',
    mood: 'nature'
  }
];
