import {create} from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast";
import { ServerRouter } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client"
import { useNavigate } from "react-router-dom";

const BASE_URL=import.meta.env.MODE=== "development"?"http://localhost:9000" :"/";


export const useAuthStore = create((set,get)=>({
    authUser: null,
    isSigningUp : false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,
    isCheckingAuth: true,

    checkAuth: async()=>{
        try {
            const res = await axiosInstance.get("/auth/check");

            set({authUser:res.data});
           
            get().connectSocket();

        } catch (error) {
            console.log("Error in checkAuth",error);
            set({authUser: null});
        }
        finally{
            set({isCheckingAuth: false});
        }
    },

  signup: async(data,navigate)=>{
    // const navigate = useNavigate();
    set({isSigningUp: true});

    try {

       const res =  await axiosInstance.post("/auth/signup",data);
       console.log(res);
       set({authUser: res.data});
        get().connectSocket();
      
       toast.success("Account Created Successfully");
   
     
        
    } catch (error) {
        toast.error("There is a error");
        console.log(error);
        
    }
    finally{
        set({isSigningUp: false});
    }
    
  },

  login: async(data)=>{
    set({isLoggingIn: true});
    
    try {

        const res = await axiosInstance.post('/auth/login',data);

        set({authUser: res.data});
        get().connectSocket();
        toast.success("Logged in Successfully");

        
    } catch (error) {
         toast.error("Error in Login ");
         console.log(error);
    }finally{
        set({isLoggingIn: false});
    }

  },

  logout: async()=>{
  
      try {
       await axiosInstance.post("/auth/logout");
        set({authUser: null});
        get().disconnectSocket();
       toast.success("Logout Successfull");
      
        
      } catch (error) {
         toast.error(error.response.data.message);
      }

  },

  updateProfile : async(data)=>{
     
    set({isUpdatingProfile: true});
    try {
        const res = await axiosInstance.put('/auth/update-profile',data);
        console.log(res);
         set({authUser: res.data});
        toast.success("Profile updated Successfully");
        
    } catch (error) {
        
        toast.error("Error Occurred");
    } finally{
          set({isUpdatingProfile: false});
    }

  },

  connectSocket:()=>{
    const {authUser} = get();
    if(!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL,{
        query:{
            userId: authUser._id,
        },
    })
    socket.connect();
    set({socket: socket});

    socket.on("getOnlineUsers",(userIds)=>{
          set({onlineUsers: userIds});
    })

  },

  disconnectSocket: ()=>{
     if(get().socket?.connected) get().socket.disconnect();
  },

}))