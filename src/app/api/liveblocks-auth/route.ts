import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";
import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import { api } from "../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(req: Request) {
  const { sessionClaims } = await auth();

  if (!sessionClaims) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await currentUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { room } = await req.json();
  const document = await convex.query(api.documents.getById, { id: room });

  if (!document) {
    return new Response("Unauthorized", { status: 401 });
  }

  const isOwner = document.ownerId === user.id;

  // Check org membership via session claims first (fast path)
  let isOrganizationMember = !!(
    document.organizationId && document.organizationId === sessionClaims.org_id
  );

  // Fallback: verify via Clerk API in case the user hasn't activated the org
  // context in their current session (org_id not present in sessionClaims)
  if (!isOwner && !isOrganizationMember && document.organizationId) {
    try {
      const clerk = await clerkClient();
      const membership = await clerk.organizations.getOrganizationMembershipList({
        organizationId: document.organizationId,
      });
      isOrganizationMember = membership.data.some(
        (m) => m.publicUserData?.userId === user.id
      );
    } catch {
      // If the Clerk API call fails, deny access
      isOrganizationMember = false;
    }
  }

  if (!isOwner && !isOrganizationMember) {
    return new Response("Unauthorized", { status: 401 });
  }

  const name = user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "Anonymous";
  const nameToNumber = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = Math.abs(nameToNumber) % 360
  const color = `hsl(${hue}, 80%, 60%)`;
  
  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name,
      avatar: user.imageUrl,
      color,
    },
  });
  session.allow(room, session.FULL_ACCESS);
  const { body, status } = await session.authorize();

  return new Response(body, { status });
}
