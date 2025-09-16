import { ChatLayout } from "@/components/chat/chat-layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat - AI Career Counselor",
  description: "Have a conversation with your AI career counselor. Get personalized advice on career development, job search strategies, and professional growth.",
  openGraph: {
    title: "Chat with AI Career Counselor",
    description: "Get personalized career guidance through AI-powered conversations",
    type: "website",
  },
};

export default function ChatPage() {
    return <ChatLayout />;
}