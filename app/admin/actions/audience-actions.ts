'use server'
import { prisma } from "@/lib/prisma"

export async function getAudience() {
  const list = await prisma.audience.findMany();
  return list;
}

export async function deleteAudience(id: string) {
  try {
    await prisma.audience.delete({
      where: { id: Number(id) },
    });
    return { success: true, message: 'Audience member deleted successfully' };
  } catch (error) {
    console.error('Error deleting audience member:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to delete audience member' 
    };
  }
}