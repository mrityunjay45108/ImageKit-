import User, { IUser } from './../app/model/User';
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../app/lib/db";


export async function GET(request: NextRequest) {
  await dbConnect();

  try {
  const {email,password,name}=await request.json()
  if (!email || !password || !name){
    return NextResponse.json({message:"missing required fields"},{status:400})
  }
  await dbConnect();
  const existUser=await User.findOne({email});
  if(existUser){
    return NextResponse.json({message:"User already exists"},{status:400})
  }
  await User.create({email,password,name} as IUser);
  return NextResponse.json({message:"User registered successfully"},{status:201})


  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json({message:"Failed to register user"},{status:500})
  }
}

