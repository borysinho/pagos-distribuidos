import PrismaClient from "@prisma/client";
const prisma = new PrismaClient.PrismaClient();

const getAllPersonas = async () => {
  const allPersonas = await prisma.persona.findMany();
  return allPersonas;
};

const getPersona = async (id) => {
  const persona = await prisma.persona.findUnique({
    where: {
      id: id,
    },
  });
  return persona;
};

export default { getAllPersonas, getPersona };
