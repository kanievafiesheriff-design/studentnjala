import React, { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, Search, Send, Users, GraduationCap } from "lucide-react";
import { useStudent } from "../context/StudentContext";
import { chatAPI } from "../services/api";
import { getSocket } from "../services/socket";

function formatTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function Avatar({ name, isLecturer }) {
  const initial = (name || "?").charAt(0).toUpperCase();
  return (
    <div
      className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold shrink-0 ${
        isLecturer ? "bg-emerald-600" : "bg-blue-600"
      }`}
    >
      {initial}
    </div>
  );
}

function roleLabel(user) {
  if (user.isLecturer || user.role === "lecturer") return "Lecturer";
  if (user.role === "clinical_supervisor") return "Clinical supervisor";
  if (user.role === "admin") return "Admin";
  return user.level || "Classmate";
}

export default function Chat() {
  const { student } = useStudent();
  const [tab, setTab] = useState("chats");
  const [search, setSearch] = useState("");
  const [contacts, setContacts] = useState({ classmates: [], lecturers: [] });
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typingName, setTypingName] = useState("");
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadInbox = useCallback(async () => {
    try {
      const [contactsRes, convRes] = await Promise.all([
        chatAPI.getContacts(),
        chatAPI.getConversations(),
      ]);
      setContacts(contactsRes.data.data);
      setConversations(convRes.data.data);
    } catch {
      setContacts({ classmates: [], lecturers: [] });
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInbox();
    const socket = getSocket();
    if (!socket) return undefined;

    const onNewMessage = (msg) => {
      if (activeConv && msg.conversationId === activeConv._id) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }
      setConversations((prev) => {
        const updated = prev.map((c) =>
          c._id === msg.conversationId
            ? {
                ...c,
                lastMessage: msg.text,
                lastMessageAt: msg.createdAt,
              }
            : c
        );
        const exists = updated.some((c) => c._id === msg.conversationId);
        if (!exists) {
          loadInbox();
          return prev;
        }
        return updated.sort(
          (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
        );
      });
    };

    const onConvUpdated = () => {
      loadInbox();
    };

    const onTyping = ({ conversationId, userName, isTyping }) => {
      if (activeConv?._id === conversationId && isTyping) {
        setTypingName(userName);
      } else {
        setTypingName("");
      }
    };

    socket.on("new_message", onNewMessage);
    socket.on("conversation_updated", onConvUpdated);
    socket.on("user_typing", onTyping);

    return () => {
      socket.off("new_message", onNewMessage);
      socket.off("conversation_updated", onConvUpdated);
      socket.off("user_typing", onTyping);
    };
  }, [activeConv, loadInbox]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingName]);

  const openConversation = async (conv) => {
    setActiveConv(conv);
    setMessages([]);
    setTypingName("");

    const socket = getSocket();
    if (socket) {
      socket.emit("join_conversation", conv._id);
    }

    try {
      const res = await chatAPI.getMessages(conv._id);
      setMessages(res.data.data);
    } catch {
      setMessages([]);
    }
  };

  const startChatWith = async (user) => {
    try {
      const res = await chatAPI.createConversation(user._id);
      const conv = res.data.data;
      setConversations((prev) => {
        const filtered = prev.filter((c) => c._id !== conv._id);
        return [conv, ...filtered];
      });
      setTab("chats");
      await openConversation(conv);
    } catch {
      /* ignore */
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !activeConv || sending) return;

    setSending(true);
    setDraft("");

    const socket = getSocket();
    if (socket?.connected) {
      socket.emit("send_message", { conversationId: activeConv._id, text }, (ack) => {
        setSending(false);
        if (ack?.success) {
          setMessages((prev) => {
            if (prev.some((m) => m._id === ack.data._id)) return prev;
            return [...prev, ack.data];
          });
          setConversations((prev) =>
            prev
              .map((c) =>
                c._id === activeConv._id
                  ? {
                      ...c,
                      lastMessage: text,
                      lastMessageAt: ack.data.createdAt,
                    }
                  : c
              )
              .sort(
                (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
              )
          );
        }
      });
      return;
    }

    try {
      const res = await chatAPI.sendMessage(activeConv._id, text);
      setMessages((prev) => [...prev, res.data.data]);
    } catch {
      setDraft(text);
    } finally {
      setSending(false);
    }
  };

  const emitTyping = (value) => {
    setDraft(value);
    const socket = getSocket();
    if (!socket || !activeConv) return;

    socket.emit("typing", { conversationId: activeConv._id, isTyping: true });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", { conversationId: activeConv._id, isTyping: false });
    }, 1200);
  };

  const filterUsers = (list) =>
    list.filter(
      (u) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.matricNumber?.toLowerCase().includes(search.toLowerCase())
    );

  const filteredConversations = conversations.filter((c) =>
    c.otherUser?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#e5ddd5] pt-20 pb-4 px-2 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 px-2 flex items-center gap-2">
          <MessageCircle className="text-emerald-700" size={28} />
          <div>
            <h1 className="text-xl font-bold text-gray-900">NUNAP Chat</h1>
            <p className="text-sm text-gray-600">
              Message classmates and lecturers — signed in as {student.fullName}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden flex h-[calc(100vh-11rem)] min-h-[420px] max-h-[720px]">
          {/* Sidebar */}
          <aside className="w-full sm:w-96 border-r flex flex-col bg-[#f0f2f5]">
            <div className="bg-[#075e54] text-white px-4 py-3 font-semibold">
              Chats
            </div>

            <div className="p-2 bg-white border-b">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="search"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-lg bg-[#f0f2f5] text-sm outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
            </div>

            <div className="flex border-b bg-white text-sm">
              <button
                type="button"
                onClick={() => setTab("chats")}
                className={`flex-1 py-2.5 font-medium ${
                  tab === "chats"
                    ? "text-emerald-700 border-b-2 border-emerald-600"
                    : "text-gray-500"
                }`}
              >
                Recent
              </button>
              <button
                type="button"
                onClick={() => setTab("classmates")}
                className={`flex-1 py-2.5 font-medium flex items-center justify-center gap-1 ${
                  tab === "classmates"
                    ? "text-emerald-700 border-b-2 border-emerald-600"
                    : "text-gray-500"
                }`}
              >
                <Users size={16} />
                Classmates
              </button>
              <button
                type="button"
                onClick={() => setTab("lecturers")}
                className={`flex-1 py-2.5 font-medium flex items-center justify-center gap-1 ${
                  tab === "lecturers"
                    ? "text-emerald-700 border-b-2 border-emerald-600"
                    : "text-gray-500"
                }`}
              >
                <GraduationCap size={16} />
                Lecturers
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <p className="p-4 text-sm text-gray-500 text-center">Loading...</p>
              ) : tab === "chats" ? (
                filteredConversations.length === 0 ? (
                  <p className="p-4 text-sm text-gray-500 text-center">
                    No chats yet. Open Classmates or Lecturers to start one.
                  </p>
                ) : (
                  filteredConversations.map((conv) => (
                    <button
                      key={conv._id}
                      type="button"
                      onClick={() => openConversation(conv)}
                      className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-white/80 text-left border-b border-gray-100 ${
                        activeConv?._id === conv._id ? "bg-white" : ""
                      }`}
                    >
                      <Avatar
                        name={conv.otherUser?.name}
                        isLecturer={conv.otherUser?.isLecturer}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2">
                          <span className="font-medium text-gray-900 truncate">
                            {conv.otherUser?.name}
                          </span>
                          <span className="text-xs text-gray-400 shrink-0">
                            {formatTime(conv.lastMessageAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {conv.lastMessage || "Start chatting"}
                        </p>
                      </div>
                    </button>
                  ))
                )
              ) : tab === "classmates" ? (
                filterUsers(contacts.classmates).length === 0 ? (
                  <p className="p-4 text-sm text-gray-500 text-center">
                    No classmates found.
                  </p>
                ) : (
                  filterUsers(contacts.classmates).map((user) => (
                    <button
                      key={user._id}
                      type="button"
                      onClick={() => startChatWith(user)}
                      className="w-full flex items-center gap-3 px-3 py-3 hover:bg-white/80 text-left border-b border-gray-100"
                    >
                      <Avatar name={user.name} isLecturer={false} />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user.matricNumber} · {roleLabel(user)}
                        </p>
                      </div>
                    </button>
                  ))
                )
              ) : filterUsers(contacts.lecturers).length === 0 ? (
                <p className="p-4 text-sm text-gray-500 text-center">
                  No lecturers listed yet.
                </p>
              ) : (
                filterUsers(contacts.lecturers).map((user) => (
                  <button
                    key={user._id}
                    type="button"
                    onClick={() => startChatWith(user)}
                    className="w-full flex items-center gap-3 px-3 py-3 hover:bg-white/80 text-left border-b border-gray-100"
                  >
                    <Avatar name={user.name} isLecturer />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">{roleLabel(user)}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </aside>

          {/* Chat panel */}
          <section className="hidden sm:flex flex-1 flex-col bg-[#efeae2]">
            {!activeConv ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8">
                <MessageCircle size={64} className="text-gray-300 mb-4" />
                <p className="text-lg font-medium text-gray-700">
                  NUNAP student messaging
                </p>
                <p className="text-sm text-center mt-2 max-w-sm">
                  Select a conversation or pick a classmate or lecturer to send
                  messages in real time.
                </p>
              </div>
            ) : (
              <>
                <header className="bg-[#075e54] text-white px-4 py-3 flex items-center gap-3">
                  <Avatar
                    name={activeConv.otherUser?.name}
                    isLecturer={activeConv.otherUser?.isLecturer}
                  />
                  <div>
                    <p className="font-semibold">{activeConv.otherUser?.name}</p>
                    <p className="text-xs text-emerald-100">
                      {typingName
                        ? `${typingName} is typing...`
                        : roleLabel(activeConv.otherUser)}
                    </p>
                  </div>
                </header>

                <div
                  className="flex-1 overflow-y-auto px-4 py-3 space-y-2"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4cdc4' fill-opacity='0.35'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                  }}
                >
                  {messages.map((msg) => {
                    const mine =
                      msg.sender?._id?.toString() === student.id?.toString();
                    return (
                      <div
                        key={msg._id}
                        className={`flex ${mine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-lg px-3 py-2 shadow-sm ${
                            mine
                              ? "bg-[#dcf8c6] rounded-tr-none"
                              : "bg-white rounded-tl-none"
                          }`}
                        >
                          <p className="text-sm text-gray-900 whitespace-pre-wrap break-words">
                            {msg.text}
                          </p>
                          <p
                            className={`text-[10px] mt-1 text-right ${
                              mine ? "text-emerald-800/60" : "text-gray-400"
                            }`}
                          >
                            {formatTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <form
                  onSubmit={handleSend}
                  className="bg-[#f0f2f5] px-3 py-2 flex gap-2 items-center border-t"
                >
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => emitTyping(e.target.value)}
                    placeholder="Type a message"
                    className="flex-1 rounded-full px-4 py-2.5 text-sm outline-none border border-gray-200 focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim() || sending}
                    className="bg-[#075e54] text-white p-2.5 rounded-full disabled:opacity-50 hover:bg-[#128c7e] transition"
                    aria-label="Send"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </>
            )}
          </section>

          {/* Mobile active chat overlay */}
          {activeConv && (
            <section className="sm:hidden fixed inset-0 z-[60] flex flex-col bg-[#efeae2] pt-16">
              <header className="bg-[#075e54] text-white px-3 py-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveConv(null)}
                  className="text-white text-sm px-2"
                >
                  ← Back
                </button>
                <Avatar
                  name={activeConv.otherUser?.name}
                  isLecturer={activeConv.otherUser?.isLecturer}
                />
                <p className="font-semibold truncate">
                  {activeConv.otherUser?.name}
                </p>
              </header>
              <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
                {messages.map((msg) => {
                  const mine =
                    msg.sender?._id?.toString() === student.id?.toString();
                  return (
                    <div
                      key={msg._id}
                      className={`flex ${mine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg px-3 py-2 shadow-sm ${
                          mine ? "bg-[#dcf8c6]" : "bg-white"
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p className="text-[10px] text-gray-400 text-right mt-1">
                          {formatTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
              <form
                onSubmit={handleSend}
                className="bg-[#f0f2f5] px-3 py-2 flex gap-2"
              >
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => emitTyping(e.target.value)}
                  placeholder="Type a message"
                  className="flex-1 rounded-full px-4 py-2 text-sm outline-none"
                />
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="bg-[#075e54] text-white p-2 rounded-full"
                >
                  <Send size={20} />
                </button>
              </form>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
