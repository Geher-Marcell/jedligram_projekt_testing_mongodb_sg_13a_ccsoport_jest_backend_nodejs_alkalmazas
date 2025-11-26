const UserController = require("../controllers/userController");
const User = require("../models/User");
const httpMocks = require("node-mocks-http");

jest.mock("../models/User");

let req, res, next;
beforeEach(() => {
	req = httpMocks.createRequest();
	res = httpMocks.createResponse();
	next = jest.fn();
});

describe("UserController tesztelés", () => {
	describe("getAllUsers", () => {
		it("rendelkeznie kell egy getAllUsers függvénnyel", () => {
			expect(typeof UserController.getAllUsers).toBe("function");
		});

		it("meg kell hívnia a User.find függvényt és vissza kell adnia a felhasználókat", async () => {
			const mockUsers = [
				{ _id: 1, name: "John Doe", email: "john@example.com" },
			];
			User.find.mockResolvedValue(mockUsers);

			await UserController.getAllUsers(req, res, next);

			expect(User.find).toHaveBeenCalled();
			expect(res.statusCode).toBe(200);
			expect(res._getJSONData()).toEqual(mockUsers);
		});

		it("hibát kell visszaadnia, ha nincs paraméter", async () => {
			req = undefined;
			await UserController.getAllUsers(req, res, next);
			expect(res.statusCode).toBe(500);
			expect(res._getJSONData()).toHaveProperty("error");
		});
	});

	describe("createUser", () => {
		it("rendelkeznie kell egy createUser függvénnyel", () => {
			expect(typeof UserController.createUser).toBe("function");
		});

		it("meg kell hívnia a User.prototype.save függvényt és vissza kell adnia az új felhasználót", async () => {
			const newUser = {
				name: "Jane Doe",
				email: "jane@example.com",
				phone: "1234567890",
				password: "password123",
			};
			const savedUser = { ...newUser, _id: 2 };
			req.body = newUser;
			User.find.mockResolvedValue([]);
			User.prototype.save = jest.fn().mockResolvedValue(savedUser);

			await UserController.createUser(req, res, next);

			expect(User.prototype.save).toHaveBeenCalled();
			expect(res.statusCode).toBe(201);
			expect(res._getJSONData()).toEqual(savedUser);
		});

		it("hibát kell visszaadnia, ha nincs paraméter", async () => {
			req.body = undefined;
			await UserController.createUser(req, res, next);
			expect(res.statusCode).toBe(400);
			expect(res._getJSONData()).toHaveProperty("error");
		});

		it("hibát kell visszaadnia, ha csak egy szöveges paraméter van", async () => {
			req.body = "invalid";
			await UserController.createUser(req, res, next);
			expect(res.statusCode).toBe(400);
			expect(res._getJSONData()).toHaveProperty("error");
		});

		it("a megfelelő értéket kell visszaadnia, ha a várt paraméterekkel hívják meg", async () => {
			const newUser = {
				name: "Jane Doe",
				email: "jane@example.com",
				phone: "1234567890",
				password: "password123",
			};
			const savedUser = { ...newUser, _id: 2 };
			req.body = newUser;
			User.find.mockResolvedValue([]);
			User.prototype.save = jest.fn().mockResolvedValue(savedUser);

			await UserController.createUser(req, res, next);

			expect(res.statusCode).toBe(201);
			expect(res._getJSONData()).toEqual(savedUser);
		});
	});

	describe("getUserById", () => {
		it("rendelkeznie kell egy getUserById függvénnyel", () => {
			expect(typeof UserController.getUserById).toBe("function");
		});

		it("meg kell hívnia a User.findOne függvényt és vissza kell adnia a felhasználót", async () => {
			const mockUser = { _id: 1, name: "John Doe", email: "john@example.com" };
			req.params.id = "1";
			User.findOne.mockResolvedValue(mockUser);

			await UserController.getUserById(req, res, next);

			expect(User.findOne).toHaveBeenCalledWith({ _id: 1 });
			expect(res.statusCode).toBe(200);
			expect(res._getJSONData()).toEqual(mockUser);
		});

		it("hibát kell visszaadnia, ha nincs paraméter", async () => {
			req.params.id = undefined;
			await UserController.getUserById(req, res, next);
			expect(res.statusCode).toBe(400);
			expect(res._getJSONData()).toHaveProperty("error");
		});

		it("hibát kell visszaadnia, ha csak egy szöveges paraméter van", async () => {
			req.params.id = "invalid";
			await UserController.getUserById(req, res, next);
			expect(res.statusCode).toBe(400);
			expect(res._getJSONData()).toHaveProperty("error");
		});

		it("a megfelelő értéket kell visszaadnia, ha a várt paraméterekkel hívják meg", async () => {
			const mockUser = { _id: 1, name: "John Doe", email: "john@example.com" };
			req.params.id = "1";
			User.findOne.mockResolvedValue(mockUser);

			await UserController.getUserById(req, res, next);

			expect(res.statusCode).toBe(200);
			expect(res._getJSONData()).toEqual(mockUser);
		});
	});

	describe("deleteUser", () => {
		it("rendelkeznie kell egy deleteUser függvénnyel", () => {
			expect(typeof UserController.deleteUser).toBe("function");
		});

		it("meg kell hívnia a User.findOneAndDelete függvényt és vissza kell adnia a sikeres üzenetet", async () => {
			req.params.id = "1";
			User.findOneAndDelete.mockResolvedValue({ _id: 1 });

			await UserController.deleteUser(req, res, next);

			expect(User.findOneAndDelete).toHaveBeenCalledWith({ _id: 1 });
			expect(res.statusCode).toBe(200);
			expect(res._getJSONData()).toEqual({
				message: "User deleted successfully",
			});
		});

		it("hibát kell visszaadnia, ha nincs paraméter", async () => {
			req.params.id = undefined;
			await UserController.deleteUser(req, res, next);
			expect(res.statusCode).toBe(400);
			expect(res._getJSONData()).toHaveProperty("error");
		});

		it("hibát kell visszaadnia, ha csak egy szöveges paraméter van", async () => {
			req.params.id = "invalid";
			await UserController.deleteUser(req, res, next);
			expect(res.statusCode).toBe(400);
			expect(res._getJSONData()).toHaveProperty("error");
		});

		it("a megfelelő értéket kell visszaadnia, ha a várt paraméterekkel hívják meg", async () => {
			req.params.id = "1";
			User.findOneAndDelete.mockResolvedValue({ _id: 1 });

			await UserController.deleteUser(req, res, next);

			expect(res.statusCode).toBe(200);
			expect(res._getJSONData()).toEqual({
				message: "User deleted successfully",
			});
		});
	});

	describe("updateUser", () => {
		it("rendelkeznie kell egy updateUser függvénnyel", () => {
			expect(typeof UserController.updateUser).toBe("function");
		});

		it("meg kell hívnia a User.findOneAndUpdate függvényt és vissza kell adnia a frissített felhasználót", async () => {
			const updatedUser = {
				name: "John Updated",
				email: "john.updated@example.com",
				phone: undefined,
				password: undefined,
			};
			req.params.id = "1";
			req.body = updatedUser;
			User.findOneAndUpdate.mockResolvedValue({ _id: 1, ...updatedUser });

			await UserController.updateUser(req, res, next);

			expect(User.findOneAndUpdate).toHaveBeenCalledWith(
				{ _id: 1 },
				updatedUser,
				{ new: true, runValidators: true }
			);
			expect(res.statusCode).toBe(200);
			expect(res._getJSONData()).toEqual({ _id: 1, ...updatedUser });
		});

		it("hibát kell visszaadnia, ha nincs paraméter", async () => {
			req.params.id = undefined;
			req.body = undefined;
			await UserController.updateUser(req, res, next);
			expect(res.statusCode).toBe(400);
			expect(res._getJSONData()).toHaveProperty("error");
		});

		it("hibát kell visszaadnia, ha csak egy szöveges paraméter van", async () => {
			req.params.id = "1";
			req.body = "invalid";
			await UserController.updateUser(req, res, next);
			expect(res.statusCode).toBe(400);
			expect(res._getJSONData()).toHaveProperty("error");
		});

		it("a megfelelő értéket kell visszaadnia, ha a várt paraméterekkel hívják meg", async () => {
			const updatedUser = {
				name: "John Updated",
				email: "john.updated@example.com",
				phone: undefined,
				password: undefined,
			};
			req.params.id = "1";
			req.body = updatedUser;
			User.findOneAndUpdate.mockResolvedValue({ _id: 1, ...updatedUser });

			await UserController.updateUser(req, res, next);

			expect(res.statusCode).toBe(200);
			expect(res._getJSONData()).toEqual({ _id: 1, ...updatedUser });
		});
	});
});
