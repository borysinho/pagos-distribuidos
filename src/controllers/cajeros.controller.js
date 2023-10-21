import cajeroService from "../services/cajero.service.js";

const postCajero = async (req, res) => {
  try {
    const cajero = await cajeroService.addCajero(req.params.id);
    res.json(cajero);
  } catch (error) {
    res.status(500).json(error);
  }
};

export default { postCajero };
