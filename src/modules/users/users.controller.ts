import { Request, Response } from "express";
import { usersService } from "./users.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const user = await usersService.createUser(
      name,
      email,
      password,
      phone,
      role
    );

    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// ------------------ Get All Users ------------------
const getUser = async (req: Request, res: Response) => {
  try {
    const users = await usersService.getUsers();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------ Get Single User ------------------
const getSingleUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string; // FIXED

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await usersService.getSingleUser(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------ Update User ------------------
const updateUser = async (req: Request, res: Response) => {
  try {
    const requester = (req as any).user;
    const userId = req.params.userId as string; 

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (requester.role === "customer" && requester.id !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const patch = { ...req.body };
    if (requester.role === "customer") {
      delete patch.role;
    }

    const updated = await usersService.updateUser(userId, patch);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// ------------------ Delete User ------------------
const deleted = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string; 

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    await usersService.deleteUser(userId);
    res.json({ message: "User deleted" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const userControllers = {
  createUser,
  getUser,
  getSingleUser,
  updateUser,
  deleted,
};
