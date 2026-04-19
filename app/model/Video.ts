import mongoose,{Schema,model,models} from "mongoose";

export const VIDEO_DIMENSIONS = {
  width: 1280,
  height: 720,
}as const;

export interface Video{
  id?:mongoose.Types.ObjectId;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  videoUrl: string;
  controls?: boolean;
  userId:mongoose.Types.ObjectId;
  transformations?: {
    width: number;
    height: number;
    quality: number;
  }
  createdAt?:Date;
  updatedAt?:Date;
}


const videoSchema = new Schema<Video>({
  title: {type:String,required:true},
  description:{type:String,required:true},
  url:{type:String,required:true},
  thumbnailUrl:{type:String,required:true},
  videoUrl:{type:String,required:true},
  controls:{type:Boolean,default:true},
  userId:{type:Schema.Types.ObjectId,ref:"User",required:true},
  transformations:{
    width:{type:Number,default:VIDEO_DIMENSIONS.width},
    height:{type:Number,default:VIDEO_DIMENSIONS.height},
    quality:{type:Number,default:80}
  }
},{
  timestamps:true
});

const VideoModel = models.Video || model<Video>("Video",videoSchema);

export default VideoModel;