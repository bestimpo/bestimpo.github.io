import type { Category } from '@/types'

export const categories: Category[] = [
  {
    slug: 'audio',
    name: 'Audio',
    blurb: 'Earbuds, headphones and speakers worth the battery life.',
    icon: 'headphones',
  },
  {
    slug: 'wearables',
    name: 'Wearables',
    blurb: 'Watches and bands that survive a real week.',
    icon: 'watch',
  },
  {
    slug: 'power',
    name: 'Power',
    blurb: 'Banks, GaN bricks and cables that charge at rated speed.',
    icon: 'battery-charging',
  },
  {
    slug: 'smart-home',
    name: 'Smart Home',
    blurb: 'Plugs, cams and sensors with local control.',
    icon: 'house',
  },
  {
    slug: 'computing',
    name: 'Computing',
    blurb: 'Docks, drives and desk gear for the daily driver.',
    icon: 'laptop',
  },
  {
    slug: 'accessories',
    name: 'Accessories',
    blurb: 'Mounts, hubs and the small parts that finish a setup.',
    icon: 'cable',
  },
]

export const categoryBySlug = new Map(categories.map((c) => [c.slug, c]))
