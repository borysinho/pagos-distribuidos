import PrismaClient from "@prisma/client";
//import { Monto } from "../interfaces/monto.interface";

const prisma = new PrismaClient.PrismaClient();

const getAllDeudas = async () => {
  const allDeudas = await prisma.deuda.findMany();
  return allDeudas;
};

const getDeuda = async (id) => {
  const deuda = await prisma.deuda.findUnique({
    where: {
      id: id,
    },
  });
  return deuda;
};

const getDeudasPersona = async (id) => {
  const deudasSinPago = await prisma.$queryRaw`
    SELECT d.*
    FROM "Deuda" d
    LEFT JOIN "Pago" p ON d.id = p."deudaId"
    WHERE d."personaId" = ${id} AND d."saldo" > 0`;
  return deudasSinPago;
};

const getMontoTotalDeudas = async (id) => {
  const montoPagado = await prisma.$queryRaw`
    SELECT SUM(d.monto)
    FROM "Deuda" d
    WHERE d."personaId" = ${id}`;
  if (montoPagado[0].sum === null) {
    return 0;
  } else {
    return montoPagado[0].sum;
  }
};

const getMontoTotalDeudasPagadas = async (id) => {
  const montoPagado = await prisma.$queryRaw`
    SELECT SUM(d.monto)
    FROM "Deuda" d
    WHERE d."personaId" = ${id} AND d."saldo" = 0`;

  if (montoPagado[0].sum === null) {
    return 0;
  } else {
    return montoPagado[0].sum;
  }
};

export default {
  getAllDeudas,
  getDeuda,
  getDeudasPersona,
  getMontoTotalDeudas,
  getMontoTotalDeudasPagadas,
};
