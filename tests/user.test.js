const UserController = require("../controllers/userController");
const User = require("../models/User");
const httpMocks = require("node-mocks-http");
const Post = require("../models/Post");

jest.mock("../models/User");
jest.mock("../models/Post");

// válzozók amik több tesztben is használva vannak
const mockUser = { _id: 1, name: "John Doe", email: "john@example.com" };
const mockUsers = [mockUser];
const validNewUser = {
	name: "Jane Doe",
	email: "jane@example.com",
	phone: "1234567890",
	password: "password123",
};
const savedNewUser = { ...validNewUser, _id: 2 };
const updatedUserData = {
	name: "John Updated",
	email: "john.updated@example.com",
	phone: undefined,
	password: undefined,
};
const invalidEmail = "invalid-email";
const validId = "1";
const invalidId = "invalid";
const nonExistentId = "999";
const successDeleteMessage = { message: "User deleted successfully" };
const errorUserNotFound = "User not found";
const errorInvalidIdFormat = "Invalid user ID format. Must be a number.";
const errorEmailExists = "An account with this email already exists.";

let req, res, next;
beforeEach(() => {
	req = httpMocks.createRequest();
	res = httpMocks.createResponse();
	next = jest.fn();
});

afterEach(() => {
	jest.clearAllMocks();
});

describe("UserController tesztelés", () => {
	describe("getAllUsers", () => {
		// Tests for the getAllUsers function
		// This test ensures the function exists and is callable
		it("rendelkeznie kell egy getAllUsers függvénnyel", () => {
			expect(typeof UserController.getAllUsers).toBe("function");
		});

		// This test verifies that getAllUsers fetches all users and returns them
		it("meg kell hívnia a User.find függvényt és vissza kell adnia a felhasználókat", async () => {
			User.find.mockResolvedValue(mockUsers);

			await UserController.getAllUsers(req, res, next);

			expect(User.find).toHaveBeenCalled();
			expect(res.statusCode).toBe(200);
			expect(res._getJSONData()).toEqual(mockUsers);
		});

		// This test checks error handling when no parameters are provided
		it("hibát kell visszaadnia, ha nincs paraméter", async () => {
			req = undefined;
			await UserController.getAllUsers(req, res, next);
			expect(res.statusCode).toBe(500);
			expect(res._getJSONData()).toHaveProperty("error");
		});
	});

	describe("createUser", () => {
		// Tests for the createUser function
		// This test ensures the function exists and is callable
		it("rendelkeznie kell egy createUser függvénnyel", () => {
			expect(typeof UserController.createUser).toBe("function");
		});

		// This test verifies that createUser saves a new user and returns it
		it("meg kell hívnia a User.prototype.save függvényt és vissza kell adnia az új felhasználót", async () => {
			req.body = validNewUser;
			User.find.mockResolvedValue([]);
			User.prototype.save = jest.fn().mockResolvedValue(savedNewUser);

			await UserController.createUser(req, res, next);

			expect(User.prototype.save).toHaveBeenCalled(); //User.prototype.save ami egy függvény ami elmenti az új felhasználót az adatbázisba
			expect(res.statusCode).toBe(201);
			expect(res._getJSONData()).toEqual(savedNewUser);
		});

		// This test checks error handling when no body is provided
		it("hibát kell visszaadnia, ha nincs paraméter", async () => {
			req.body = undefined;
			await UserController.createUser(req, res, next);
			expect(res.statusCode).toBe(400);
			expect(res._getJSONData()).toHaveProperty("error");
		});

		// This test checks error handling when an invalid parameter is provided
		it("hibát kell visszaadnia, ha csak egy szöveges paraméter van", async () => {
			req.body = invalidId;
			await UserController.createUser(req, res, next);
			expect(res.statusCode).toBe(400);
			expect(res._getJSONData()).toHaveProperty("error");
		});

		// This test checks that the correct value is returned when called with the expected parameters
		it("a megfelelő értéket kell visszaadnia, ha a várt paraméterekkel hívják meg", async () => {
			req.body = validNewUser;
			User.find.mockResolvedValue([]);
			User.prototype.save = jest.fn().mockResolvedValue(savedNewUser);

			await UserController.createUser(req, res, next);

			expect(res.statusCode).toBe(201);
			expect(res._getJSONData()).toEqual(savedNewUser);
		});

		// This test checks error handling when required fields are missing
		it("hibát kell visszaadnia, ha hiányoznak a mezők", async () => {
			req.body = { email: validNewUser.email };
			await UserController.createUser(req, res, next);
			expect(res.statusCode).toBe(400);
			expect(res._getJSONData()).toHaveProperty("error");
		});

		// This test checks error handling when the email already exists
		it("hibát kell visszaadnia, ha az email már létezik", async () => {
			req.body = validNewUser;
			User.findOne.mockResolvedValue({ email: validNewUser.email });
			await UserController.createUser(req, res, next);
			expect(res.statusCode).toBe(409);
			expect(res._getJSONData()).toHaveProperty("error", errorEmailExists);
		});

		// This test checks error handling when the email format is invalid
		it("hibát kell visszaadnia, ha az email formátuma érvénytelen", async () => {
			req.body = { ...validNewUser, email: invalidEmail };
			await UserController.createUser(req, res, next);
			expect(res.statusCode).toBe(400);
			expect(res._getJSONData()).toHaveProperty("error");
		});
	});

	describe("getUserById", () => {
		// Tests for the getUserById function
		// This test ensures the function exists and is callable
		it("rendelkeznie kell egy getUserById függvénnyel", () => {
			expect(typeof UserController.getUserById).toBe("function");
		});

		// This test verifies that getUserById fetches a user by ID and returns it
		it("meg kell hívnia a User.findOne függvényt és vissza kell adnia a felhasználót", async () => {
			req.params.id = validId;
			User.findOne.mockResolvedValue(mockUser);

			await UserController.getUserById(req, res, next);

			expect(User.findOne).toHaveBeenCalledWith({ _id: 1 });
			expect(res.statusCode).toBe(200);
			expect(res._getJSONData()).toEqual(mockUser);
		});

		// This test checks error handling when no ID parameter is provided
		it("hibát kell visszaadnia, ha nincs paraméter", async () => {
			req.params.id = undefined;
			await UserController.getUserById(req, res, next);
			expect(res.statusCode).toBe(400);
			expect(res._getJSONData()).toHaveProperty("error");
		});

		// This test checks error handling when an invalid ID parameter is provided
		it("hibát kell visszaadnia, ha csak egy szöveges paraméter van", async () => {
			req.params.id = invalidId;
			await UserController.getUserById(req, res, next);
			expect(res.statusCode).toBe(400);
			expect(res._getJSONData()).toHaveProperty("error");
		});

		// This test checks that the correct value is returned when called with the expected ID parameter
		it("a megfelelő értéket kell visszaadnia, ha a várt paraméterekkel hívják meg", async () => {
			req.params.id = validId;
			User.findOne.mockResolvedValue(mockUser);

			await UserController.getUserById(req, res, next);

			expect(res.statusCode).toBe(200);
			expect(res._getJSONData()).toEqual(mockUser);
		});

		// This test checks error handling when the user does not exist
		it("hibát kell visszaadnia, ha a felhasználó nem létezik", async () => {
			req.params.id = nonExistentId;
			User.findOne.mockResolvedValue(null);
			await UserController.getUserById(req, res, next);
			expect(res.statusCode).toBe(404);
			expect(res._getJSONData()).toHaveProperty("error", errorUserNotFound);
		});

		// This test checks error handling when the ID format is invalid
		it("hibát kell visszaadnia, ha az ID formátuma érvénytelen", async () => {
			req.params.id = "invalid-id";
			await UserController.getUserById(req, res, next);
			expect(res.statusCode).toBe(400);
			expect(res._getJSONData()).toHaveProperty("error", errorInvalidIdFormat);
		});
	});

	describe("deleteUser", () => {
		// Tests for the deleteUser function
		// This test ensures the function exists and is callable
		it("rendelkeznie kell egy deleteUser függvénnyel", () => {
			expect(typeof UserController.deleteUser).toBe("function");
		});

		// This test verifies that deleteUser deletes a user and returns a success message
		it("meg kell hívnia a User.findOneAndDelete függvényt és vissza kell adnia a sikeres üzenetet", async () => {
			req.params.id = validId;
			User.findOneAndDelete.mockResolvedValue({ _id: 1 });

			await UserController.deleteUser(req, res, next);

			expect(User.findOneAndDelete).toHaveBeenCalledWith({ _id: 1 });
			expect(res.statusCode).toBe(200);
			expect(res._getJSONData()).toEqual(successDeleteMessage);
		});

		// This test checks error handling when no ID parameter is provided
		it("hibát kell visszaadnia, ha nincs paraméter", async () => {
			req.params.id = undefined;
			await UserController.deleteUser(req, res, next);
			expect(res.statusCode).toBe(400);
			expect(res._getJSONData()).toHaveProperty("error");
		});

		// This test checks error handling when an invalid ID parameter is provided
		it("hibát kell visszaadnia, ha csak egy szöveges paraméter van", async () => {
			req.params.id = invalidId;
			await UserController.deleteUser(req, res, next);
			expect(res.statusCode).toBe(400);
			expect(res._getJSONData()).toHaveProperty("error");
		});

		// This test checks that the correct value is returned when called with the expected ID parameter
		it("a megfelelő értéket kell visszaadnia, ha a várt paraméterekkel hívják meg", async () => {
			req.params.id = validId;
			User.findOneAndDelete.mockResolvedValue({ _id: 1 });

			await UserController.deleteUser(req, res, next);

			expect(res.statusCode).toBe(200);
			expect(res._getJSONData()).toEqual(successDeleteMessage);
		});

		// This test checks error handling when the user does not exist
		it("hibát kell visszaadnia, ha a felhasználó nem létezik", async () => {
			req.params.id = nonExistentId;
			User.findOneAndDelete.mockResolvedValue(null);
			await UserController.deleteUser(req, res, next);
			expect(res.statusCode).toBe(404);
			expect(res._getJSONData()).toHaveProperty("error", errorUserNotFound);
		});
	});

	describe("updateUser", () => {
		// Tests for the updateUser function
		// This test ensures the function exists and is callable
		it("rendelkeznie kell egy updateUser függvénnyel", () => {
			expect(typeof UserController.updateUser).toBe("function");
		});

		// This test verifies that updateUser updates a user and returns the updated user
		it("meg kell hívnia a User.findOneAndUpdate függvényt és vissza kell adnia a frissített felhasználót", async () => {
			req.params.id = validId;
			req.body = updatedUserData;
			User.findOneAndUpdate.mockResolvedValue({ _id: 1, ...updatedUserData });

			await UserController.updateUser(req, res, next);

			expect(User.findOneAndUpdate).toHaveBeenCalledWith(
				{ _id: 1 },
				updatedUserData,
				{ new: true, runValidators: true }
			);
			expect(res.statusCode).toBe(200);
			expect(res._getJSONData()).toEqual({ _id: 1, ...updatedUserData });
		});

		// This test checks error handling when no parameters are provided
		it("hibát kell visszaadnia, ha nincs paraméter", async () => {
			req.params.id = undefined;
			req.body = undefined;
			await UserController.updateUser(req, res, next);
			expect(res.statusCode).toBe(400);
			expect(res._getJSONData()).toHaveProperty("error");
		});

		// This test checks error handling when an invalid parameter is provided
		it("hibát kell visszaadnia, ha csak egy szöveges paraméter van", async () => {
			req.params.id = validId;
			req.body = invalidId;
			await UserController.updateUser(req, res, next);
			expect(res.statusCode).toBe(400);
			expect(res._getJSONData()).toHaveProperty("error");
		});

		// This test checks that the correct value is returned when called with the expected parameters
		it("a megfelelő értéket kell visszaadnia, ha a várt paraméterekkel hívják meg", async () => {
			req.params.id = validId;
			req.body = updatedUserData;
			User.findOneAndUpdate.mockResolvedValue({ _id: 1, ...updatedUserData });

			await UserController.updateUser(req, res, next);

			expect(res.statusCode).toBe(200);
			expect(res._getJSONData()).toEqual({ _id: 1, ...updatedUserData });
		});

		// This test checks error handling when called with partial fields
		it("hibát kell visszaadnia, ha részleges mezőkkel hívják meg", async () => {
			req.params.id = validId;
			req.body = { name: "John Updated" };
			User.findOneAndUpdate.mockResolvedValue(null);
			await UserController.updateUser(req, res, next);
			expect(res.statusCode).toBe(404);
			expect(res._getJSONData()).toHaveProperty("error", errorUserNotFound);
		});

		// This test checks error handling when the email format is invalid
		it("hibát kell visszaadnia, ha az email formátuma érvénytelen", async () => {
			req.params.id = validId;
			req.body = { ...validNewUser, email: invalidEmail };
			await UserController.updateUser(req, res, next);
			expect(res.statusCode).toBe(400);
			expect(res._getJSONData()).toHaveProperty("error");
		});
	});


	 describe("getPostsByUserId", () => {
	 	const mockUserPosts = [
	 		{ _id: 101, user_id: 1, content: "First post" },
	 		{ _id: 102, user_id: 1, content: "Second post" },
	 	];

		it("rendelkeznie kell egy getPostsByUserId függvénnyel", () => {
			expect(typeof UserController.getPostsByUserId).toBe("function");
		});

		it("vissza kell adnia egy felhasználó összes posztját (200)", async () => {
			req.params.id = validId; // "1"
			User.findOne.mockResolvedValue(mockUser); 
			Post.find.mockResolvedValue(mockUserPosts);

			await UserController.getPostsByUserId(req, res, next);

			expect(User.findOne).toHaveBeenCalledWith({ _id: 1 });
			expect(Post.find).toHaveBeenCalledWith({ user_id: 1 });
			expect(res.statusCode).toBe(200);
			expect(res._getJSONData()).toEqual(mockUserPosts);
});

	it("vissza kell adnia egy üres tömböt, ha a felhasználónak nincsenek posztjai (200)", async () => {
		req.params.id = validId; // "1"
		User.findOne.mockResolvedValue(mockUser);
		Post.find.mockResolvedValue([]); 

		await UserController.getPostsByUserId(req, res, next);

		expect(User.findOne).toHaveBeenCalledWith({ _id: 1 });
		expect(Post.find).toHaveBeenCalledWith({ user_id: 1 });
		expect(res.statusCode).toBe(200);
		expect(res._getJSONData()).toEqual([]);
	});

	it("hibát kell visszaadnia, ha a felhasználói ID érvénytelen (400)", async () => {
		req.params.id = invalidId; 
		await UserController.getPostsByUserId(req, res, next);

			expect(res.statusCode).toBe(400);
			expect(res._getJSONData()).toHaveProperty("error", errorInvalidIdFormat);
			expect(User.findOne).not.toHaveBeenCalled();
			expect(Post.find).not.toHaveBeenCalled();
		});

		it("hibát kell visszaadnia, ha a felhasználó nem található (404)", async () => {
			req.params.id = nonExistentId; 
			User.findOne.mockResolvedValue(null); 

			await UserController.getPostsByUserId(req, res, next);

			expect(User.findOne).toHaveBeenCalledWith({ _id: 999 });
			expect(Post.find).not.toHaveBeenCalled(); 
			expect(res.statusCode).toBe(404);
			expect(res._getJSONData()).toHaveProperty("error", errorUserNotFound);
		});
});
});
