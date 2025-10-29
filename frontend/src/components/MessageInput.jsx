import { useRef, useState } from "react"
import { useChatStore } from "../store/useChatStore"
import { X, Send, Image } from "lucide-react"
import toast from "react-hot-toast"

const MessageInput = () => {
  const [text, setText] = useState("")
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)
  const { sendMessage } = useChatStore()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!text.trim() && !imagePreview) return
    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      })
      setText("")
      setImagePreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
    } catch (error) {
      console.log("Failed to send message:", error)
    }
  }

  return (
    <div className="p-2 sm:p-3 border-t border-base-300 bg-base-100">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-3">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-base-300"
            />
            <button
              onClick={removeImage}
              type="button"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-base-200 flex items-center justify-center shadow"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2 bg-base-200 rounded-full px-3 py-2"
      >
        <button
          type="button"
          className="text-zinc-500 hover:text-emerald-500 transition"
          onClick={() => fileInputRef.current?.click()}
        >
          <Image size={22} />
        </button>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        <input
          type="text"
          className="flex-1 bg-transparent outline-none text-sm sm:text-base px-2"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className={`transition-colors p-2 rounded-full ${
            text.trim() || imagePreview
              ? "text-emerald-500 hover:bg-emerald-500/10"
              : "text-zinc-400 cursor-not-allowed"
          }`}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  )
}

export default MessageInput
