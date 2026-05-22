import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/utils/password";
import { categoryNames, menuData } from "./menu-data";

async function main() {
  // Default admin account — change the password after first login.
  const adminEmail = "admin@food.app";
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: await hashPassword("admin123"),
      role: "ADMIN",
      isVerified: true,
    },
  });
  console.log(`✔ Admin user ready: ${admin.email} (password: admin123)`);

  // Reset the menu. Orders reference foods, so clear them first.
  await prisma.foodOrderItem.deleteMany();
  await prisma.foodOrder.deleteMany();
  await prisma.food.deleteMany();
  await prisma.foodCategory.deleteMany();

  let foodCount = 0;
  for (const [key, items] of Object.entries(menuData)) {
    const category = await prisma.foodCategory.create({
      data: { categoryName: categoryNames[key] ?? key },
    });
    await prisma.food.createMany({
      data: items.map((item) => ({
        foodName: item.title,
        price: item.price,
        // Request a web-sized image so the optimizer is not fed huge originals.
        image: `${item.image}?w=800&q=80`,
        ingredients: item.description,
        categoryId: category.id,
      })),
    });
    foodCount += items.length;
  }
  console.log(
    `✔ Seeded ${Object.keys(menuData).length} categories and ${foodCount} foods`,
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
