
import { eq } from "drizzle-orm";
import db from "../../db/db.js";
import { eventDetails, userDetails } from "../../db/schema/schema.js";
import { signUpSchema, updateUserSchema } from "../validators/vaildation.js";

//Profile/data of admin
const Profile = async (req, res) => {
  const user = req.user;
  if (user) {
    return res.status(200).json({ msg: "User Profile", userDetails: user });
  }
  return res.status(501).json({ msg: "User not found" });
};


const UpdateUser = async(req,res)=>{
    const user = req.user
    const body = req.body
    const success = updateUserSchema.safeParse(body)
    if (!{ success }) {
    return res.json({ msg: "Wrong input during Update" });
  }

    const result = await db.update(userDetails).set(body).where(eq(userDetails.userId,user.userId)).returning()

    if(!result){
        return res.status(502).json({msg:"User not updated, Something went wrong"})
    }

    return res.status(200).json({msg:"User updated succesfully",updatedUser:result[0]})

}

const DeleteUser = async (req,res) =>{
    const user = req.user
    const result = await db.delete(userDetails).where(eq(userDetails.userId,user.userId))
    if(!result){
        return res.status(502).json({msg:"User not deleted, Something went wrong"})
    }

    return res.status(200).json({msg:"User deleted succesfully"})
}

const getAllEvent = async(req,res) =>{
    const events = await db.select().from(eventDetails) 
    if(!events){
      return res.status(401).json({ msg: "Something went wrong data not found" });
    }
    res.status(200).json({ msg: "All user details", events: events});
}

const getEvent = async(req,res) =>{
  const eventId = req.params.id
  const [event] = await db.select().from(eventDetails).where(eq(eventDetails.eventId,eventId))
  if(!event){
    return res.status(401).json({ msg: "Something went wrong data not found" });
  }
  res.status(200).json({ msg: "All user details", event: event});
}

export {
    Profile,
    UpdateUser,
    DeleteUser,
    getAllEvent,
    getEvent
}