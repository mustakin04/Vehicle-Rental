import { Router } from "express";
import { body } from "express-validator";
import { vehiclesControllers } from "./vehicles.controller";
import { handleValidation } from "../../middleware/validate.middleware";
import { authenticate, authorize } from "../../middleware/auth.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("admin"),
  handleValidation,
  vehiclesControllers.createVehicle
);
router.get("/", vehiclesControllers.getVehicles);
router.get("/:vehicleId", vehiclesControllers.getVehicle);


router.put(
  "/:vehicleId",
  authenticate,
  authorize("admin"),
  vehiclesControllers.updateVehicle
);

router.delete("/:vehicleId", authenticate, authorize("admin"), vehiclesControllers.deleted);

export default router;
