import { auth, currentUser } from "@clerk/nextjs/server"

type EmailRecord = { emailAddress: string }

type ClerkUserLike = {
  id?: string
  fullName?: string | null
  firstName?: string | null
  lastName?: string | null
  username?: string | null
  primaryEmailAddress?: EmailRecord | null
  emailAddresses?: Array<EmailRecord | string>
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function getAdminEmail() {
  const value = process.env.ADMIN_EMAIL?.trim()
  return value ? normalizeEmail(value) : null
}

export function getUserEmails(user: ClerkUserLike | null | undefined) {
  if (!user) return []

  const addresses = new Set<string>()

  if (user.primaryEmailAddress?.emailAddress) {
    addresses.add(normalizeEmail(user.primaryEmailAddress.emailAddress))
  }

  for (const entry of user.emailAddresses ?? []) {
    const email = typeof entry === "string" ? entry : entry.emailAddress
    if (email) {
      addresses.add(normalizeEmail(email))
    }
  }

  return [...addresses]
}

export function isAdminUser(user: ClerkUserLike | null | undefined) {
  const adminEmail = getAdminEmail()

  if (!adminEmail || !user) {
    return false
  }

  return getUserEmails(user).includes(adminEmail)
}

export function getUserDisplayName(user: ClerkUserLike | null | undefined) {
  if (!user) return "Unknown user"

  const fullName = user.fullName?.trim()
  if (fullName) return fullName

  const fallbackName = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(" ")
    .trim()
  if (fallbackName) return fallbackName

  if (user.username) return user.username

  return getUserPrimaryEmail(user) ?? user.id ?? "Unknown user"
}

export function getUserPrimaryEmail(user: ClerkUserLike | null | undefined) {
  return (
    user?.primaryEmailAddress?.emailAddress ?? getUserEmails(user)[0] ?? null
  )
}

export async function getCurrentUserAdminState() {
  const { userId } = await auth()

  if (!userId) {
    return { userId: null, user: null, isAdmin: false }
  }

  const user = await currentUser()

  return {
    userId,
    user,
    isAdmin: isAdminUser(user),
  }
}
