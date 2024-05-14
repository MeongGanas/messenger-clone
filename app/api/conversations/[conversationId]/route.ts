import getCurrentUser from "@/app/actions/getCurrentUser";
import db from "@/app/libs/db";
import { NextResponse } from "next/server";

interface IParams {
  conversationId?: string;
}

export async function DELETE(req: Request, { params }: { params: IParams }) {
  try {
    const { conversationId } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const existingConversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: {
        users: true,
      },
    });

    if (!existingConversation) {
      return new NextResponse("No conversation found", { status: 401 });
    }

    const deletedConversation = await db.conversation.deleteMany({
      where: { id: conversationId, userIds: { hasSome: [currentUser.id] } },
    });

    return NextResponse.json(deletedConversation);
  } catch (err) {
    console.log("ERROR CONVERSATION DELETE");
    return new NextResponse("Internal server error", { status: 500 });
  }
}
