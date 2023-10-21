//import { Request, Response } from "express";
import personaService from "../services/persona.service.js";

const getAllPersonas = async (req, res) => {
  try {
    const allPersonas = await personaService.getAllPersonas();
    res.json(allPersonas);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getPersona = async (req, res) => {
  try {
    const persona = await personaService.getPersona(parseInt(req.params.id));
    res.json(persona);
  } catch (error) {
    res.status(500).json(error);
  }
};

export default { getAllPersonas, getPersona };
