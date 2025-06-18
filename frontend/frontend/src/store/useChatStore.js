import {create } from "zustand";
import toast from "react-hot-toast";
import  { axiosInstance} from "../lib/axios.js";
import { Axis3D } from "lucide-react";
import { useAuthStore } from "./useAuthStore.js";



export const useChatStore = create((set,get) =>({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async()=>{
        set({isUsersLoading: true});

      try {
        const res = await axiosInstance.get("/messages/users");

        const usersArray = Array.isArray(res.data) ? res.data : [];
     set({ users: usersArray });
        
      } catch (error) {
         toast.error("Error occurred in finding users");
      }finally{
        set({isUsersLoading: false});
      }

    },

    getMessages: async(userId)=>{
      set({isMessagesLoading: true});

      try {
          const res = await axiosInstance.get(`/messages/${userId}`);
          set({messages: res.data});
      } catch (error) {
        toast.error("Error in finding messages");
      } finally{
        set({isMessagesLoading: false});
      }
    },
    sendMessages: async(messageData)=>{
      const { selectedUser,messages } = get();

      try {
         
           const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData);
           console.log(res);
           set({messages:[...messages,res.data]});
           console.log(messages);


      } catch (error) {
        toast.error("Error in sending messages");
        
      }

    },

    subscribeToMessages: ()=>{
       
      const{ selectedUser} = get();
      if(!selectedUser) return ;
      
      
      const socket = useAuthStore.getState().socket;

      socket.on("newMessage",(newMessage)=>{
        const {messages} = get();
        set({
          messages: [...messages,newMessage],
        });
      })

    },
    unsubscribeFromMessages:()=>{
      const socket = useAuthStore.getState().socket;
      socket.off("newMessage");
    },

    setSelectedUser: (selectedUser)=> set({selectedUser}),
}) ); 