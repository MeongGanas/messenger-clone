import { Suspense } from "react";
import getConversation from "../actions/getConversation";
import Sidebar from "../components/sidebar/Sidebar";
import ConversationList from "./components/ConversationList";

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await getConversation();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Sidebar>
        <ConversationList initialItems={conversations} />
        <div className="h-full">{children}</div>
      </Sidebar>
    </Suspense>
  );
}
