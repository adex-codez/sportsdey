import { defineConfig } from "better-auth/cli";
import { auth } from "./src/auth/cli";

export default defineConfig({
	auth,
	output: "./src/db/auth-schema",
});
