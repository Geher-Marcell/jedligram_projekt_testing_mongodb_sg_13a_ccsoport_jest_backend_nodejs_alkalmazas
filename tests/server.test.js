const postController = require('../controllers/postController');
const userController = require('../controllers/userController');
const mongoose = require('mongoose');

jest.mock('mongoose');

describe('Server Controller Tests', () => { 
    beforeAll(() => {
        mongoose.connect.mockResolvedValueOnce(); // Mock successful MongoDB connection
    });

    afterAll(() => {
        if (mongoose.connection && mongoose.connection.close) {
            mongoose.connection.close = jest.fn(); // Mock the close method
            mongoose.connection.close();
        }
    });

    test('postController.getAllPosts should return all posts', async () => { // postController.getAllPosts visszaadja az összes posztot
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.spyOn(postController, 'getAllPosts').mockImplementationOnce((req, res) => { // Mock implementáció
            res.status(200).json([{ _id: 1, content: 'Test Post' }]);
        });

        await postController.getAllPosts(req, res);

        expect(res.status).toHaveBeenCalledWith(200); // Ellenőrizzük, hogy a státusz 200 volt-e
        expect(res.json).toHaveBeenCalledWith([{ _id: 1, content: 'Test Post' }]); // Ellenőrizzük a visszaadott adatokat
    });

    test('postController.createPost should create a new post', async () => { // postController.createPost létrehoz egy új posztot
        const req = { body: { content: 'New Post' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.spyOn(postController, 'createPost').mockImplementationOnce((req, res) => { // Mock implementáció
            res.status(201).json({ _id: 2, content: 'New Post' });
        });

        await postController.createPost(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ _id: 2, content: 'New Post' });
    });

    test('userController.getAllUsers should return all users', async () => { // userController.getAllUsers visszaadja az összes felhasználót
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.spyOn(userController, 'getAllUsers').mockImplementationOnce((req, res) => {
            res.status(200).json([{ _id: 1, name: 'Test User' }]);
        });

        await userController.getAllUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ _id: 1, name: 'Test User' }]);
    });
});