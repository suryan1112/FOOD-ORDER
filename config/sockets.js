import { Server } from 'socket.io'
import items from '../models/items.js';
import user from '../models/users.js';
import comments from '../models/comments.js';
import sub_comments from '../models/sub_comments.js';

const userSocketMap = {};

export const socket_connection=(server)=>{
    const io = new Server(server)

    io.on('connection', (socket) => {
        // console.log('a user connected');
        
        socket.emit('server-client','server is connected to client')
        
        socket.on('setUserID',(User_id)=>{
            userSocketMap[User_id]=socket.id
        })

        socket.on('like-handeling', async (object,{ userId, itemId }) => {
            console.log(`${userId} has liked the item: ${itemId}`)
            try {
                let obj;
                if(object=='items') obj = await items.findById(itemId);
                if(object=='comments') obj = await comments.findById(itemId);
                if(object=='sub_comments') obj = await sub_comments.findById(itemId);

                const userz=await user.findById(userId);
                // console.log(obj.user_id, userSocketMap[obj.user_id])

                let msg=`messege not initialized`;
                if(object=='items') msg=`${userz.name} liked your ${obj.name} ❤️`
                else msg=`${userz.name} liked your comment: ${obj.content.substring(0, 30)}${obj.content.length <= 30 ? "" : "..."} ❤️`

                if(obj.user_id==userz.id) msg=`you, Liked your own ${object} 🤷`

                io.to(userSocketMap[obj.user_id]).emit('notification', msg);
                
            } catch (error) {
                console.error('Error:', error.message);
            }
        })
        socket.on('comment-handeling', async (object,{ userId, itemId }) => {
            console.log(`${userId} has commented: ${itemId}`)
            try {
                let obj;
                if(object=='item') obj = await items.findById(itemId);
                if(object=='comment'){
                    obj = await comments.findById(itemId);
                    await obj.populate('item_id')
                }

                const userz=await user.findById(userId);
                console.log(obj.user_id, userSocketMap[obj.user_id])

                let msg=`messege not initialized`;
                if(object=='item') msg=`${userz.name} commented on ${obj.name} `
                else msg=`${userz.name} commented on: ${obj.content.substring(0, 30)}${obj.content.length <= 30 ? "" : "..."}[${obj.item_id.name}]`

                if(obj.user_id==userz.id) msg=`commented yourself 🤔`

                io.to(userSocketMap[obj.user_id]).emit('notification', msg);
                
            } catch (error) {
                console.error('Error:', error.message);
            }
        })
        socket.on('item-handeling', async(object,user,item_name)=>{
            try {
                let msg=`messege not initialized`;
                if(object=='add') msg=`${item_name} has been added by ${user}`
                if(object=='remove') msg=`${item_name} has been removed by ${user}`

                // console.log(msg)
                // console.log(obj.user_id, userSocketMap[obj.user_id])

                io.emit('notification', msg);
                
            } catch (error) {
                console.error('Error:', error.message);
            }
        })
        socket.on('disconnect',()=>{
            // console.log('socket disconnected')
        })
    });
}