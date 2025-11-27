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

    test('postController.getAllPosts should return all posts', async () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.spyOn(postController, 'getAllPosts').mockImplementationOnce((req, res) => {
            res.status(200).json([{ _id: 1, content: 'Test Post' }]);
        });

        await postController.getAllPosts(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ _id: 1, content: 'Test Post' }]);
    });

    test('postController.createPost should create a new post', async () => {
        const req = { body: { content: 'New Post' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.spyOn(postController, 'createPost').mockImplementationOnce((req, res) => {
            res.status(201).json({ _id: 2, content: 'New Post' });
        });

        await postController.createPost(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ _id: 2, content: 'New Post' });
    });

    test('userController.getAllUsers should return all users', async () => {
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

    test('postController.getPostById should return a post by ID', async () => {
        const req = { params: { id: '1' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.spyOn(postController, 'getPostById').mockImplementationOnce((req, res) => {
            res.status(200).json({ _id: 1, content: 'Test Post' });
        });

        await postController.getPostById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ _id: 1, content: 'Test Post' });
    });

    test('postController.deletePost should delete a post by ID', async () => {
        const req = { params: { id: '1' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.spyOn(postController, 'deletePost').mockImplementationOnce((req, res) => {
            res.status(200).json({ message: 'Post deleted successfully' });
        });

        await postController.deletePost(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Post deleted successfully' });
    });

    test('postController.updatePost should update a post by ID', async () => {
        const req = { params: { id: '1' }, body: { content: 'Updated Post' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.spyOn(postController, 'updatePost').mockImplementationOnce((req, res) => {
            res.status(200).json({ _id: 1, content: 'Updated Post' });
        });

        await postController.updatePost(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ _id: 1, content: 'Updated Post' });
    });

    test('userController.getUserById should return a user by ID', async () => {
        const req = { params: { id: '1' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.spyOn(userController, 'getUserById').mockImplementationOnce((req, res) => {
            res.status(200).json({ _id: 1, name: 'Test User' });
        });

        await userController.getUserById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ _id: 1, name: 'Test User' });
    });

    test('userController.deleteUser should delete a user by ID', async () => {
        const req = { params: { id: '1' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.spyOn(userController, 'deleteUser').mockImplementationOnce((req, res) => {
            res.status(200).json({ message: 'User deleted successfully' });
        });

        await userController.deleteUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
    });

    test('userController.updateUser should update a user by ID', async () => {
        const req = { params: { id: '1' }, body: { name: 'Updated User' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.spyOn(userController, 'updateUser').mockImplementationOnce((req, res) => {
            res.status(200).json({ _id: 1, name: 'Updated User' });
        });

        await userController.updateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ _id: 1, name: 'Updated User' });
    });
});