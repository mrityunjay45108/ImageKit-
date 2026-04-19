import { Session } from '../../../node_modules/next-auth/core/types';
import dbConnect from "@/app/lib/db";
import Video from "@/app/model/Video";
import { getSession } from 'next-auth/react';
import { NextRequest, NextResponse } from "next/server";

export async function GET () {try {
    await dbConnect();
    const videos = await Video.find({}).sort({ createdAt: -1 });
    if (!videos || videos.length === 0) {
      return new Response("No videos found", { status: 404 });
    }
    return NextResponse.json(videos, { status: 200 });
  } catch (error) {
    console.error("Error in video route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
  try {
    const Session = await getSession();
    if (!Session || !Session.users) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = Session.users.id;
    const { title, description, url } = await request.json();
    if (!title || !description || !url) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }
    await dbConnect();
    const newVideo = new Video({
      title,
      description,
      url,
      userId,
    });
    await newVideo.save();
    return NextResponse.json({ message: "Video uploaded successfully", video: newVideo }, { status: 201 });
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json({ message: "Failed to create video" }, { status: 500 });
  }
}
