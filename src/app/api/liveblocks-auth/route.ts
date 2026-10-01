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

  let document: Awaited<ReturnType<typeof convex.query<typeof api.documents.getById>>> | null = null;
  try {
    document = await convex.query(api.documents.getById, { id: room });
  } catch (err) {
    console.error("[liveblocks-auth] Convex getById failed:", err);
    return new Response("Unauthorized", { status: 401 });
  }

  if (!document) {
    console.error("[liveblocks-auth] Document not found for room:", room);
    return new Response("Unauthorized", { status: 401 });
  }

  const isOwner = document.ownerId === user.id;

  // Fast path: session claims have the active org
  let isOrganizationMember = !!(
    document.organizationId && document.organizationId === sessionClaims.org_id
  );

  console.log("[liveblocks-auth] Debug:", {
    userId: user.id,
    documentOwnerId: document.ownerId,
    documentOrgId: document.organizationId,
    sessionOrgId: sessionClaims.org_id,
    isOwner,
    isOrganizationMember,
  });

  // Fallback: check the user's own org memberships via Clerk API.
  // This handles the case where the user is in the org but their Clerk session
  // doesn't have org_id active (e.g., they logged in via personal workspace).
  if (!isOwner && !isOrganizationMember && document.organizationId) {
    try {
      const clerk = await clerkClient();
      // Get all orgs this specific user belongs to (avoids pagination issues
      // of listing all org members)
      const userMemberships = await clerk.users.getOrganizationMembershipList({
        userId: user.id,
      });
      isOrganizationMember = userMemberships.data.some(
        (m) => m.organization.id === document!.organizationId
      );
      console.log("[liveblocks-auth] Fallback org check:", {
        userOrgIds: userMemberships.data.map((m) => m.organization.id),
        documentOrgId: document.organizationId,
        isOrganizationMember,
      });
    } catch (err) {
      console.error("[liveblocks-auth] Clerk API fallback failed:", err);
      isOrganizationMember = false;
    }
  }

  if (!isOwner && !isOrganizationMember) {
    console.error("[liveblocks-auth] Access denied — not owner and not org member");
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
