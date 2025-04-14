import { useEffect, useRef, useState } from "react";
import { getDatabase, ref, push, onValue, serverTimestamp } from "firebase/database";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { IoMdSend } from "react-icons/io";
import { IoMdChatbubbles, IoMdClose } from "react-icons/io";

const ChatBox = () => {
    const [user] = useAuthState(auth);
    const [messages, setMessages] = useState([]);
    const [newMsg, setNewMsg] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const messagesEndRef = useRef(null);
    const db = getDatabase();
    const firestore = getFirestore();

    // Fetch messages
    useEffect(() => {
        const chatRef = ref(db, "general_chat");
        let lastRead = Date.now(); // Track when the user last read

        const unsubscribe = onValue(chatRef, async (snapshot) => {
            const data = snapshot.val() || {};
            const parsed = await Promise.all(
                Object.entries(data).map(async ([id, msg]) => {
                    let senderName = "Unknown";
                    try {
                        const userSnap = await getDoc(doc(firestore, "users", msg.uid));
                        if (userSnap.exists()) {
                            senderName = userSnap.data().name;
                        }
                    } catch (err) {
                        console.error("Error fetching user name:", err);
                    }

                    return {
                        id,
                        ...msg,
                        name: senderName,
                    };
                })
            );

            const sorted = parsed.sort((a, b) => a.timestamp - b.timestamp);
            setMessages(sorted);

            if (!isOpen) {
                const newMsgs = sorted.filter((msg) => msg.timestamp > lastRead && msg.uid !== user?.uid);
                setUnreadCount(newMsgs.length);
            } else {
                lastRead = Date.now();
                setUnreadCount(0);
            }
        });

        return () => unsubscribe();
    }, [isOpen, firestore, db, user]);

    // Auto-scroll
    useEffect(() => {
        if (isOpen && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);

    const handleSend = () => {
        if (!newMsg.trim()) return;
        const chatRef = ref(db, "general_chat");
        push(chatRef, {
            uid: user.uid,
            message: newMsg,
            timestamp: Date.now(),
        });
        setNewMsg("");
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {isOpen ? (
                <div className="w-80 bg-white shadow-lg rounded-xl border flex flex-col h-96">
                    {/* Header */}
                    <div className="flex items-center justify-between bg-purple-600 text-white px-4 py-2 rounded-t-xl">
                        <h4 className="font-semibold">General Chat</h4>
                        <button onClick={() => { setIsOpen(false); setUnreadCount(0); }}>
                            <IoMdClose size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`max-w-[75%] px-3 py-2 rounded-lg text-sm shadow ${msg.uid === user.uid ? "ml-auto bg-purple-100 text-right" : "bg-gray-100 text-left"
                                    }`}
                            >
                                <div className="text-xs font-semibold text-gray-600 capitalize">{msg?.name?.split(' ')[0]}</div>
                                <div>{msg.message}</div>
                                <div className="text-[10px] text-gray-500">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-2 border-t flex items-center">
                        <input
                            type="text"
                            value={newMsg}
                            onChange={(e) => setNewMsg(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Type a message..."
                            className="flex-1 px-3 py-2 border rounded-lg text-sm"
                        />
                        <button onClick={handleSend} className="ml-2 text-purple-600 hover:text-purple-800">
                            <IoMdSend size={20} />
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => { setIsOpen(true); setUnreadCount(0); }}
                    className="relative bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700"
                >
                    <IoMdChatbubbles size={24} />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white px-1.5 rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </button>
            )}
        </div>
    );
};

export default ChatBox;
