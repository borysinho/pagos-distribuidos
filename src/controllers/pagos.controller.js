//import { Request, Response } from "express";
import pagoService from "../services/pago.service.js";

const getAllPagos = async (req, res) => {
  try {
    const allPagos = await pagoService.getAllPagos();
    res.json(allPagos);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getPago = async (req, res) => {
  try {
    const pago = await pagoService.getPago(parseInt(req.params.id));
    res.json(pago);
  } catch (error) {
    res.status(500).json(error);
  }
};

const createPago = async (req, res) => {
  try {
    const newPago = await pagoService.createPago(req.body);
    res.json(newPago);
    //Ya no hago el pago, solo agrego a la cola y respondo al cliente que se registró la solicitud
    // pagoService.pushPago(req.body);
    // res.json(req.body);
  } catch (error) {
    res.status(500).json(error);
  }
};

export default { getAllPagos, getPago, createPago };
