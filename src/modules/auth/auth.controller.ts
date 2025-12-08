import { Request, Response } from "express";
import { authService } from "./auth.service";

const signup = async (req: Request, res: Response) => {
  try {
    const user = await authService.signup(req.body.name, req.body.email, req.body.password, req.body.phone, req.body.role);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

const signin = async (req: Request, res: Response) => {
  try {
    const data = await authService.signin(req.body.email, req.body.password);
    res.json(data);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const authControllers = { signup, signin };
