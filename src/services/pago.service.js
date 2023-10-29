import PrismaClient from "@prisma/client";
import { parentPort } from "worker_threads";

const prisma = new PrismaClient.PrismaClient();

const pagosArray = [];

const getAllPagos = async () => {
  const allPagos = await prisma.pago.findMany();
  return allPagos;
};

const getPago = async (id) => {
  const pago = await prisma.pago.findUnique({
    where: {
      id: id,
    },
  });
  return pago;
};

const getPagoHash = async (hashPago) => {
  const pago = await prisma.pago.findUnique({
    where: {
      pagoHash: String(hashPago),
    },
  });
  return pago;
};

const createPago = async (newPago) => {
  if (!newPago.monto) {
    return "El monto es requerido.";
  }
  if (!newPago.deudaId) {
    return "La deuda es requerida.";
  }

  const deuda = await prisma.deuda.findUnique({
    where: {
      id: newPago.deudaId,
    },
  });

  if (!deuda) {
    return "La deuda no existe.";
  }

  if (deuda.saldo <= 0) {
    return "La deuda ya fue cancelada.";
  }

  if (newPago.monto > deuda.saldo) {
    return "El monto del pago no puede ser mayor al saldo de la deuda.";
  }

  await prisma.deuda.update({
    where: {
      id: newPago.deudaId,
    },
    data: {
      saldo: deuda.saldo - newPago.monto,
    },
  });

  const pago = await prisma.pago.create({
    data: {
      monto: newPago.monto,
      pagoHash: String(newPago.pagoHash),
      deuda: {
        connect: {
          id: newPago.deudaId,
        },
      },
    },
  });

  return pago;
};

parentPort?.on;

export default { getAllPagos, getPago, createPago };
