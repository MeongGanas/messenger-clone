import getCurrentUser from "@/app/actions/getCurrentUser";
import db from "@/app/libs/db";
import { NextResponse } from "next/server";

interface IParams {
  conversationId?: string;
}

export async function POST(req: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();
    const { conversationId } = params;

    if (!currentUser?.id || !currentUser.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });

    if (!conversation) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const lastMessages =
      conversation.messages[conversation.messages.length - 1];

    if (!lastMessages) {
      return NextResponse.json(conversation);
    }

    const updatedMessage = await db.message.update({
      where: { id: lastMessages.id },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    return NextResponse.json(updatedMessage);
  } catch (err: any) {
    console.log(err, "ERROR MESSAGES SEEN");
    return new NextResponse("internal error", { status: 500 });
  }
}
