import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

export const doctorOnly = (req, res, next) => {
  if (req.user.role !== 'doctor') {
    return res.status(403).json({ error: 'Acceso denegado. Solo doctores.' });
  }
  next();
};

export const patientOnly = (req, res, next) => {
  if (req.user.role !== 'patient') {
    return res.status(403).json({ error: 'Acceso denegado. Solo pacientes.' });
  }
  next();
};
