import { useState } from "react";
import { Send } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const MessageInput = () => {
  const [text, setText] = useState("");
  const { sendMessage } = useChatStore();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    try {
      await sendMessage({ text: trimmed });
      setText("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <form onSubmit={handleSendMessage} className="p-4 flex items-center gap-2">
      <input
        type="text"
        className="flex-1 input input-bordered rounded-lg input-sm sm:input-md"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        type="submit"
        className="btn btn-sm btn-circle"
        disabled={!text.trim()}
      >
        <Send size={20} />
      </button>
    </form>
  );
};

export default MessageInput;
