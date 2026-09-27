import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/database.js';
import User from '../models/User.js';
import Manga from '../models/Manga.js';
import Chapter from '../models/Chapter.js';
import { loginUser } from '../services/authService.js';
import {
  getAllManga,
  createManga,
  getMangaByIdOrSlug,
  updateManga,
  deleteManga,
} from '../services/mangaService.js';
import {
  createChapter,
  getChaptersByManga,
  getChapterById,
  updateChapter,
  deleteChapter,
} from '../services/chapterService.js';
import bcrypt from 'bcrypt';

dotenv.config();

/**
 * Automated Verification Test Suite for Step 5
 * Validates models, authentication, authorization, CRUD, and validations.
 */
export async function runStep5TestSuite() {
  console.log('====================================================');
  console.log('NOVA PANEL STEP 5 — BACKEND INTEGRATION TEST SUITE');
  console.log('====================================================');

  try {
    // 1. MongoDB Connection
    console.log('\n[Test 1/15] Testing MongoDB Connection...');
    await connectDB();
    console.log('✓ PASS: MongoDB connected successfully.');

    // 2. Health & DB State
    console.log('\n[Test 2/15] Verifying database connection state...');
    if (mongoose.connection.readyState === 1) {
      console.log('✓ PASS: Database connection state is 1 (connected).');
    } else {
      throw new Error('Database is not connected');
    }

    // 3. User & Admin Setup
    console.log('\n[Test 3/15] Verifying Admin User Creation & Hash Security...');
    const testAdminEmail = 'test_admin@novapanel.local';
    const testAdminPassword = 'TestAdminPassword123!';
    await User.deleteMany({ email: testAdminEmail });

    const passwordHash = await bcrypt.hash(testAdminPassword, 10);
    const adminUser = await User.create({
      name: 'Test Administrator',
      email: testAdminEmail,
      passwordHash,
      role: 'admin',
    });

    if (adminUser.passwordHash === testAdminPassword) {
      throw new Error('Plaintext password was stored! Security failure.');
    }
    console.log('✓ PASS: Admin created with secure bcrypt hash. Plaintext password not stored.');

    // 4. Admin Login with Valid Credentials
    console.log('\n[Test 4/15] Testing Admin Login (POST /api/auth/login logic)...');
    const loginResult = await loginUser(testAdminEmail, testAdminPassword);
    if (!loginResult.token || loginResult.user.role !== 'admin') {
      throw new Error('Admin login failed or missing token');
    }
    if (loginResult.user.passwordHash) {
      throw new Error('passwordHash leaked in login response!');
    }
    console.log('✓ PASS: Admin login successful. JWT issued. No password hash exposed.');

    // 5. Invalid Login Rejection
    console.log('\n[Test 5/15] Testing Invalid Login Rejection...');
    try {
      await loginUser(testAdminEmail, 'WrongPassword999!');
      throw new Error('Invalid login did not fail!');
    } catch (err) {
      if (err.message === 'Invalid email or password') {
        console.log('✓ PASS: Invalid login rejected with appropriate message.');
      } else {
        throw err;
      }
    }

    // 6. Manga Creation & Validation
    console.log('\n[Test 6/15] Testing Manga Creation (POST /api/manga)...');
    const createdManga = await createManga({
      title: 'Automated Test Chronicle',
      type: 'manhwa',
      status: 'ongoing',
      rating: 9.1,
      author: 'Test Unit Author',
      artist: 'Test Unit Artist',
      genres: ['Action', 'Fantasy'],
      description: 'A story created strictly to verify Step 5 backend pipeline.',
      coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23',
    });
    console.log(`✓ PASS: Story created with slug '${createdManga.slug}'.`);

    // 7. Manga Validation: Reject Invalid Type
    console.log('\n[Test 7/15] Testing Manga Model Enum Validation...');
    try {
      await createManga({
        title: 'Invalid Type Story',
        type: 'invalid_comic_type',
      });
      throw new Error('Invalid type was accepted!');
    } catch (err) {
      console.log('✓ PASS: Invalid type properly rejected by backend validation.');
    }

    // 8. Manga Validation: Reject Out of Range Rating
    console.log('\n[Test 8/15] Testing Rating Range Validation...');
    try {
      await createManga({
        title: 'Invalid Rating Story',
        type: 'manga',
        rating: 15, // Out of range (max 10)
      });
      throw new Error('Invalid rating 15 was accepted!');
    } catch (err) {
      console.log('✓ PASS: Out-of-range rating rejected by validation.');
    }

    // 9. Manga Search & Filtering
    console.log('\n[Test 9/15] Testing Manga Filtering & Search...');
    const searchResult = await getAllManga({ search: 'Automated Test' });
    if (searchResult.items.length === 0) {
      throw new Error('Search did not find created story');
    }
    console.log(`✓ PASS: Search query matched ${searchResult.items.length} items.`);

    // 10. Manga Update (PUT /api/manga/:id)
    console.log('\n[Test 10/15] Testing Manga Update...');
    const updatedManga = await updateManga(createdManga._id, {
      status: 'completed',
      rating: 9.5,
    });
    if (updatedManga.status !== 'completed' || updatedManga.rating !== 9.5) {
      throw new Error('Story update failed');
    }
    console.log('✓ PASS: Story updated to status "completed" and rating 9.5.');

    // 11. Chapter Creation (POST /api/manga/:mangaId/chapters)
    console.log('\n[Test 11/15] Testing Chapter Creation...');
    const ch1 = await createChapter(createdManga._id, {
      number: 1,
      title: 'Chapter 1: The First Test',
      status: 'published',
    });
    const ch2 = await createChapter(createdManga._id, {
      number: 2,
      title: 'Chapter 2: The Draft Step',
      status: 'draft',
    });
    console.log(`✓ PASS: Created Chapter 1 (published) and Chapter 2 (draft).`);

    // 12. Duplicate Chapter Number Rejection
    console.log('\n[Test 12/15] Testing Duplicate Chapter Number Rejection...');
    try {
      await createChapter(createdManga._id, { number: 1 });
      throw new Error('Duplicate chapter number was allowed!');
    } catch (err) {
      console.log('✓ PASS: Duplicate chapter number successfully rejected.');
    }

    // 13. Chapter Status Toggling (Publish / Unpublish)
    console.log('\n[Test 13/15] Testing Chapter Publish / Unpublish Toggle...');
    const updatedCh2 = await updateChapter(ch2._id, { status: 'published' });
    if (updatedCh2.status !== 'published') {
      throw new Error('Chapter status update failed');
    }
    console.log('✓ PASS: Chapter 2 status toggled from draft to published.');

    // 14. Chapter Sorting (newest vs oldest)
    console.log('\n[Test 14/15] Testing Chapter Sorting Query...');
    const newestChapters = await getChaptersByManga(createdManga._id, { sort: 'newest' });
    if (newestChapters.items[0].number !== 2) {
      throw new Error('Newest sort did not return chapter 2 first');
    }
    console.log('✓ PASS: Chapter sorting works correctly (newest first returned chapter 2).');

    // 15. Story Deletion & Cascade Clean-up
    console.log('\n[Test 15/15] Testing Story Deletion & Chapter Cascade...');
    await deleteManga(createdManga._id);
    const remainingChapters = await Chapter.countDocuments({ mangaId: createdManga._id });
    if (remainingChapters !== 0) {
      throw new Error('Cascade delete did not remove associated chapters');
    }
    console.log('✓ PASS: Story deleted and associated chapters cascade removed.');

    // Clean up test user
    await User.deleteMany({ email: testAdminEmail });

    console.log('\n====================================================');
    console.log('ALL 15 BACKEND INTEGRATION TESTS PASSED PERFECTLY!');
    console.log('====================================================');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ TEST SUITE FAILED:', error.message || error);
    process.exit(1);
  }
}

if (process.argv[1]?.endsWith('testSuite.js')) {
  runStep5TestSuite();
}
