import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader'
import MessageSkeleton from './skeletons/MessageSkeleton'
import MessageInput from './MessageInput'
import { useAuthStore } from '../store/useAuthStore'
import avatar from '../assets/avatar.png'
import { formMessageTime } from '../lib/utils'
import { useRef } from 'react'
const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore()
  const { authUser } = useAuthStore()

  const messageEndRef = useRef()

  useEffect(() => {
    
    getMessages(selectedUser._id)

    subscribeToMessages()

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages])

  useEffect(()=> {
    if(messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  if (isMessagesLoading) {
    return (
      <div className='flex-1 flex-col overflow-auto'>
        <ChatHeader />
        <MessageSkeleton />
      </div>
    )
  }

  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />

      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.map((message) => (
          <div key={message._id} className={`chat ${message.senderId === authUser._id ? "chat-end": "chat-start"}`}
            ref={messageEndRef}>

            <div className='chat-image avatar'>
              <div className='size-10 rounded-full border'>
                <img src={message.senderId === authUser._id ? authUser.profilePic || avatar : selectedUser.profilePic || avatar} alt="profile pic" />
              </div>
            </div>
            <div className='chat-header mb-1'>
              <time dateTime="text-xs opacity-50 ml-1">
                {formMessageTime(message.createdAt)}
              </time>
            </div>
            {/* The message details */}
            <div className='chat-bubble flex-col'>
              {message.image && (
                <img src={message.image} alt="Attachement" className='sm:max-w-[200px] rounded-md mb-2' />
              )}
              {message.text && <p>{message.text}</p> }
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  )
}

export default ChatContainer
