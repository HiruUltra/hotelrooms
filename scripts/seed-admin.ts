import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main() {
  const [{ default: bcrypt }, { connectDb }, { default: User }] = await Promise.all([
    import("bcryptjs"),
    import("@/lib/db"),
    import("@/models/User")
  ]);
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required.");
  }
  await connectDb();
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await User.findOneAndUpdate(
    { email: adminEmail.toLowerCase() },
    {
      name: "Hotel Admin",
      email: adminEmail.toLowerCase(),
      passwordHash,
      role: "admin",
      phone: "+94000000000"
    },
    { upsert: true, new: true, runValidators: true }
  );
  console.log(`Admin account ready: ${adminEmail}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
