import db from "../libs/db";

export default async function getMessages(conversationId: string) {
  try {
    const messages = await db.message.findMany({
      where: { conversationId },
      include: {
        sender: true,
        seen: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return messages;
  } catch (err) {
    return [];
  }
}
