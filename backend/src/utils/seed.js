import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { connectDB } from '../config/database.js';
import User from '../models/User.js';
import Manga from '../models/Manga.js';
import Chapter from '../models/Chapter.js';
import { slugify } from './slugify.js';

dotenv.config();

const FICTIONAL_STORIES = [
  {
    title: 'Beyond the Last Horizon',
    alternativeTitles: ['Last Horizon Saga', 'Beyond the Edge of Stars', 'Saigo no Suiheisen'],
    type: 'manhwa',
    status: 'ongoing',
    rating: 8.9,
    author: 'Kaelen Vance',
    artist: 'Studio Aurelius',
    genres: ['Fantasy', 'Adventure', 'Mystery'],
    description: 'When an ancient celestial gate awakens on the edge of the known universe, an exiled navigator and an arcane cartographer embark on a perilous voyage beyond the charted star-realms, uncovering lost civilizations and forgotten cosmic laws.',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1400&auto=format&fit=crop&q=80',
    featured: true,
    views: 1200000,
    chapterCount: 15,
  },
  {
    title: 'Crimson Archive',
    alternativeTitles: ['The Blood Grimoires', 'Red Ledger Chronicles', 'Shinku no Kiroku'],
    type: 'manga',
    status: 'ongoing',
    rating: 8.9,
    author: 'Rin Takahashi',
    artist: 'Rin Takahashi',
    genres: ['Mystery', 'Supernatural', 'Drama'],
    description: 'In an underground library sealed during the imperial collapse, forbidden grimoires whisper historical truths that rewrite reality itself whenever read aloud.',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1507842229451-79b1be8d62ee?w=1400&auto=format&fit=crop&q=80',
    featured: false,
    views: 980000,
    chapterCount: 12,
  },
  {
    title: 'Moonlit Requiem',
    alternativeTitles: ['Nocturne of the Silver Bell', 'Gekkou no Chinkonkyoku'],
    type: 'manhwa',
    status: 'ongoing',
    rating: 9.2,
    author: 'Min-jun Park',
    artist: 'Red Ink Atelier',
    genres: ['Action', 'Fantasy', 'Supernatural'],
    description: 'A spectral swordsman wanders the rain-swept borderlands, seeking the lunar bell that can sever demonic curses bound to mortal bloodlines.',
    coverImage: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1400&auto=format&fit=crop&q=80',
    featured: false,
    views: 850000,
    chapterCount: 10,
  },
  {
    title: 'Neon Ronin: 2099',
    alternativeTitles: ['Cyber Blade', 'Neo Edo Chronicles'],
    type: 'webtoon',
    status: 'ongoing',
    rating: 9.1,
    author: 'Cipher_9',
    artist: 'VectorPulse',
    genres: ['Sci-Fi', 'Action', 'Cyberpunk'],
    description: 'In the high-altitude corporate megacity of Neo-Tokyo, a decommissioned cyber-samurai takes dirty freelance contracts while protecting the last natural biome enclave.',
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1400&auto=format&fit=crop&q=80',
    featured: true,
    views: 1450000,
    chapterCount: 14,
  },
  {
    title: 'The Alchemist of Solitude',
    alternativeTitles: ['Hermit of the Obsidian Vale'],
    type: 'manga',
    status: 'completed',
    rating: 9.4,
    author: 'Elena Rostova',
    artist: 'Elena Rostova',
    genres: ['Slice of Life', 'Fantasy', 'Philosophical'],
    description: 'An ancient immortal alchemist lives quietly in an enchanted mountain valley, transmuting remedies for lost travelers while recording the rise and fall of dynasties.',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1400&auto=format&fit=crop&q=80',
    featured: false,
    views: 720000,
    chapterCount: 20,
  },
  {
    title: 'Heavens Fall Protocol',
    alternativeTitles: ['Ascension Overdrive', 'Skyward Rupture'],
    type: 'manhua',
    status: 'ongoing',
    rating: 8.6,
    author: 'Li Wei',
    artist: 'Celestial Forge Studio',
    genres: ['Cultivation', 'Action', 'Fantasy'],
    description: 'When the heavenly barrier shatters under mechanized spiritual bombardment, an unorthodox cultivator merges ancient meridians with forbidden stellar engineering.',
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1400&auto=format&fit=crop&q=80',
    featured: false,
    views: 610000,
    chapterCount: 16,
  },
  {
    title: 'Abyssal Echoes',
    alternativeTitles: ['Deep Trench Requiem'],
    type: 'manhwa',
    status: 'hiatus',
    rating: 8.4,
    author: 'Dae-hyun Kim',
    artist: 'Abyss Works',
    genres: ['Horror', 'Mystery', 'Psychological'],
    description: 'A deep-sea research submarine intercepts biological radio frequencies from beneath the oceanic mantle, revealing sentient cities older than terrestrial life.',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1400&auto=format&fit=crop&q=80',
    featured: false,
    views: 430000,
    chapterCount: 8,
  },
  {
    title: 'Clockwork Valkyrie',
    alternativeTitles: ['Gears of Valhalla', 'Aethelgard Brass'],
    type: 'manga',
    status: 'ongoing',
    rating: 8.8,
    author: 'Arthur Pendelton',
    artist: 'Iron Guild',
    genres: ['Steampunk', 'Action', 'Military'],
    description: 'In an alternate 19th-century Europe suspended upon soaring steam-powered dreadnoughts, an elite aerial engineer reconstructs legendary clockwork armor.',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1400&auto=format&fit=crop&q=80',
    featured: false,
    views: 520000,
    chapterCount: 11,
  },
  {
    title: 'Spirit Weaver of Jiangnan',
    alternativeTitles: ['Silk of the Hidden Gods'],
    type: 'manhua',
    status: 'completed',
    rating: 9.3,
    author: 'Chen Xiao',
    artist: 'Chen Xiao',
    genres: ['Historical', 'Supernatural', 'Romance'],
    description: 'A master textile artisan weaves celestial silk capable of stitching broken memories, attracting the gaze of mountain immortals and wandering spirits.',
    coverImage: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1400&auto=format&fit=crop&q=80',
    featured: false,
    views: 890000,
    chapterCount: 18,
  },
  {
    title: 'Infinite Dungeon Overlord',
    alternativeTitles: ['Floor 1000 Architect'],
    type: 'webtoon',
    status: 'ongoing',
    rating: 8.7,
    author: 'Song Jin-woo',
    artist: 'Nexus Line Studio',
    genres: ['Fantasy', 'Action', 'System'],
    description: 'When the world turned into a labyrinthine dungeon tower, an architect awakened the unique ability not to climb the tower, but to redesign its floors.',
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1400&auto=format&fit=crop&q=80',
    featured: true,
    views: 1800000,
    chapterCount: 14,
  },
  {
    title: 'Crown of Obsidian Petals',
    alternativeTitles: ['The Thorned Empress'],
    type: 'manhwa',
    status: 'ongoing',
    rating: 9.0,
    author: 'Clara Dubois',
    artist: 'Atelier Noir',
    genres: ['Romance', 'Drama', 'Fantasy'],
    description: 'Betrayed on her wedding eve, the disowned duchess is reincarnated ten years in the past with the dark knowledge of imperial treason and a pact with the shadow court.',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1507842229451-79b1be8d62ee?w=1400&auto=format&fit=crop&q=80',
    featured: false,
    views: 950000,
    chapterCount: 13,
  },
  {
    title: 'Verdant Core',
    alternativeTitles: ['The Biosphere Protocol', 'Green Haven Chronicles'],
    type: 'manga',
    status: 'completed',
    rating: 8.5,
    author: 'Tatsuki Sato',
    artist: 'Tatsuki Sato',
    genres: ['Sci-Fi', 'Adventure', 'Ecological'],
    description: 'Following total desertification of Earth, two scrap hunters discover an underground biosphere maintained by sentient botanical drones.',
    coverImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&auto=format&fit=crop&q=80',
    featured: false,
    views: 640000,
    chapterCount: 15,
  },
];

export async function seedDatabase() {
  try {
    console.log('Starting NOVA PANEL development database seed...');
    await connectDB();

    // 1. Seed Admin User
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@novapanel.local').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword123!';
    const adminName = process.env.ADMIN_NAME || 'Nova Admin';

    let adminUser = await User.findOne({ email: adminEmail });
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    if (adminUser) {
      adminUser.role = 'admin';
      adminUser.name = adminName;
      adminUser.passwordHash = passwordHash;
      await adminUser.save();
      console.log(`Admin user '${adminEmail}' updated.`);
    } else {
      adminUser = await User.create({
        name: adminName,
        email: adminEmail,
        passwordHash,
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      });
      console.log(`Admin user '${adminEmail}' created.`);
    }

    // 2. Clear existing Stories and Chapters for a clean development seed
    await Chapter.deleteMany({});
    await Manga.deleteMany({});
    console.log('Cleaned existing manga and chapter collections.');

    // 3. Seed Stories and Chapters
    for (const storyData of FICTIONAL_STORIES) {
      const slug = slugify(storyData.title);
      const manga = await Manga.create({
        title: storyData.title,
        alternativeTitles: storyData.alternativeTitles,
        slug,
        description: storyData.description,
        coverImage: storyData.coverImage,
        bannerImage: storyData.bannerImage,
        type: storyData.type,
        status: storyData.status,
        author: storyData.author,
        artist: storyData.artist,
        genres: storyData.genres,
        rating: storyData.rating,
        views: storyData.views,
        featured: storyData.featured,
      });

      // Create chapters
      const chaptersToCreate = [];
      const count = storyData.chapterCount || 10;

      for (let ch = 1; ch <= count; ch++) {
        // Last chapter may be draft for testing draft status
        const isDraft = ch === count;
        chaptersToCreate.push({
          mangaId: manga._id,
          number: ch,
          title: `Chapter ${ch}: The Path Ahead`,
          slug: `chapter-${ch}`,
          status: isDraft ? 'draft' : 'published',
          publishedAt: new Date(Date.now() - (count - ch) * 24 * 60 * 60 * 1000),
          pages: [], // As required for Step 5
        });
      }

      await Chapter.insertMany(chaptersToCreate);
      console.log(`Seeded '${manga.title}' with ${chaptersToCreate.length} chapters.`);
    }

    console.log('Development database seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed process failed:', error.message || error);
    process.exit(1);
  }
}

// Run directly if called as a script
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase();
}
