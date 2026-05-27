import { Request, Response } from "express";
import { prisma } from "../../backend/src/lib/prisma";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Хэрэглэгчдийг авахад алдаа гарлаа" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id },
    });
    res.json({ message: "Хэрэглэгч амжилттай устгагдлаа" });
  } catch (error) {
    res.status(500).json({ message: "Хэрэглэгчийг устгахад алдаа гарлаа" });
  }
};
