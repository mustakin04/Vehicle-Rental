import { Request, Response } from "express";
import { vehiclesService } from "./vehicles.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const created = await vehiclesService.createVehicle(payload);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

const getVehicles = async (req: Request, res: Response) => {
  try {
    const list = await vehiclesService.getVehicles();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

const getVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleId = req.params.vehicleId;

    if (!vehicleId || typeof vehicleId !== "string") {
      return res.status(400).json({ message: "Invalid vehicle ID" });
    }

    const v = await vehiclesService.getSingleVehicle(vehicleId);
    if (!v) return res.status(404).json({ message: "Vehicle not found" });

    res.json(v);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleId = req.params.vehicleId;

    if (!vehicleId || typeof vehicleId !== "string") {
      return res.status(400).json({ message: "Invalid vehicle ID" });
    }

    const updated = await vehiclesService.updateVehicle(vehicleId, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

const deleted = async (req: Request, res: Response) => {
  try {
    const vehicleId = req.params.vehicleId;

    if (!vehicleId || typeof vehicleId !== "string") {
      return res.status(400).json({ message: "Invalid vehicle ID" });
    }

    await vehiclesService.deleteVehicle(vehicleId);
    res.json({ message: "Vehicle deleted" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const vehiclesControllers = {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deleted,
};
