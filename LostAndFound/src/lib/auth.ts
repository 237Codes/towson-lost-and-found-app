import { db, Session, User } from "astro:db";
import { Lucia } from "lucia";
import { AstroDBAdapter } from "lucia-adapter-astrodb";

import type { DatabaseUser } from "db/config.ts";
const adapter = new AstroDBAdapter(db, Session, User);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: import.meta.env.PROD,
    },
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes["username"],
      admin: attributes["admin"],
      name: attributes["name"],
      student_number: attributes["student_number"],
      mbti: attributes["mbti"],
      class_id: attributes["class_id"],
      team_id: attributes["team_id"],
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<DatabaseUser, "id">;
  }
}
