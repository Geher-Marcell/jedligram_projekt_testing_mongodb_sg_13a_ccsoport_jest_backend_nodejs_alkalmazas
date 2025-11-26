const Post = require('../models/Post');
const mongoose = require('mongoose');

beforeEach(() => {
    jest.clearAllMocks(); // a mockok törlése minden teszt előtt
});

afterEach(() => {
    jest.restoreAllMocks(); // Eredeti cuccok visszaállítása minden teszt után
});

const TEST_DATA = {
    validPost: { _id: 1, user_id: 10, content: 'Hello world' },
    missingId: { user_id: 10, content: 'no id' },
    missingUser: { _id: 2, content: 'no user' },
    missingContent: { _id: 3, user_id: 5 },
    invalidId: { _id: 'not-a-number', user_id: 1, content: 'x' },
    validWithLikes: { _id: 4, user_id: 11, content: 'likes', likeCount: 7 },
};

describe('Post Model Validation', () => {
    describe('Validation and Defaults', () => {
        test('valid post passes validation and defaults applied', () => { // érvényes post validáció és alapértelmezett értékek
            const post = new Post(TEST_DATA.validPost);
            const err = post.validateSync();
            expect(err).toBeUndefined();
            expect(post.likeCount).toBe(0);
            expect(post.created_at).toBeInstanceOf(Date);
        });

        test('missing required fields produce validation errors', () => { // hiányzó kötzelező mezők
            const missingId = new Post(TEST_DATA.missingId);
            const e1 = missingId.validateSync();
            expect(e1).toBeDefined();
            expect(e1.errors._id).toBeDefined();

            const missingUser = new Post(TEST_DATA.missingUser);
            const e2 = missingUser.validateSync();
            expect(e2).toBeDefined();
            expect(e2.errors.user_id).toBeDefined();

            const missingContent = new Post(TEST_DATA.missingContent);
            const e3 = missingContent.validateSync();
            expect(e3).toBeDefined();
            expect(e3.errors.content).toBeDefined();
        });

        test('likeCount accepts numeric values', () => { // likeCount numerikus értékeket fogad el
            const p = new Post(TEST_DATA.validWithLikes);
            const err = p.validateSync();
            expect(err).toBeUndefined();
            expect(typeof p.likeCount).toBe('number');
            expect(p.likeCount).toBe(7);
        });

        test('invalid _id type causes validation error', () => { // érvénytelen _id típus validációs hibát okoz
            const bad = new Post(TEST_DATA.invalidId);
            const e = bad.validateSync();
            expect(e).toBeDefined();
            expect(e.errors._id).toBeDefined();
        });

        test('invalid likeCount type causes validation error', () => { // érvénytelen likeCount típus validációs hibát okoz
            const badLike = new Post({ _id: 5, user_id: 12, content: 'bad like', likeCount: 'a lot' });
            const e = badLike.validateSync();
            expect(e).toBeDefined();
            expect(e.errors.likeCount).toBeDefined();
        });

        test('created_at defaults to current date if not provided', () => { // created_at alapértelmezett értéke a jelenlegi dátum
            const p = new Post({ _id: 6, user_id: 13, content: 'check date' });
            const err = p.validateSync();
            expect(err).toBeUndefined();
            expect(p.created_at).toBeInstanceOf(Date);
            const now = new Date();
            expect(Math.abs(p.created_at.getTime() - now.getTime())).toBeLessThan(1000); // kevesebb, mint 1 másodperc lehet max az eltérés
        });
    });
});

describe('Post Model Mocking', () => { // Post modell mockolása azért hogy ne kelljen adatbázishoz kapcsolódni
    test('mock save method', async () => {
        const saveMock = jest.spyOn(Post.prototype, 'save').mockImplementationOnce(async () => {
            return TEST_DATA.validPost;
        });

        const post = new Post(TEST_DATA.validPost);
        const result = await post.save();

        expect(saveMock).toHaveBeenCalledTimes(1);
        expect(result).toEqual(TEST_DATA.validPost);
    });

    test('mock find method', async () => {
        const findMock = jest.spyOn(Post, 'find').mockImplementationOnce(async () => {
            return [TEST_DATA.validPost];
        });

        const result = await Post.find({ user_id: 10 });

        expect(findMock).toHaveBeenCalledTimes(1);
        expect(result).toEqual([TEST_DATA.validPost]);
    });
});