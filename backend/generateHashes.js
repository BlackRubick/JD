import bcrypt from 'bcryptjs';

const passwords = {
  'doctor123': await bcrypt.hash('doctor123', 10),
  'prueba123': await bcrypt.hash('prueba123', 10)
};

console.log('Hashes de contraseñas:');
console.log('doctor123:', passwords['doctor123']);
console.log('prueba123:', passwords['prueba123']);
