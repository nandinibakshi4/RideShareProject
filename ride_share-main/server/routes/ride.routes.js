import express from "express";
import { 
  createRide, 
  getAllRides, 
  getRide, 
  updateRide, 
  deleteRide, 
  findRides, 
  joinRide 
} from "../controllers/ride.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// Get all rides (admin only)
router.get("/", verifyAdmin, getAllRides);

// Create ride
router.post("/", verifyToken, createRide);

// Search rides
router.get("/find", findRides);

// Get single ride
router.get("/:id", getRide);

// ✅ Join ride (fix: only define once, and in the right order)
router.post("/:rideId/join", verifyToken, joinRide);


// Update ride
router.patch("/:id", verifyUser, updateRide);

// Delete ride
router.delete("/:id", verifyToken, deleteRide);

export default router;
