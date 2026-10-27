export const serviceNames = Object.freeze({
  mobiliario: 'Mobiliário por medida', restauro: 'Restauro e renovação', planeamento: 'Planeamento de interiores', outro: 'Ainda estou a explorar',
});

export function validateRequest(input) {
  const data = Object.fromEntries(['name', 'email', 'service', 'message'].map(key => [key, typeof input[key] === 'string' ? input[key].trim() : '']));
  const errors = {};
  if (data.name.length < 2 || data.name.length > 80) errors.name = 'Indique um nome entre 2 e 80 caracteres.';
  if (data.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Indique um endereço de email válido, por exemplo nome@example.com.';
  if (!Object.hasOwn(serviceNames, data.service)) errors.service = 'Escolha um dos serviços disponíveis.';
  if (data.message.length < 20 || data.message.length > 2000) errors.message = 'Descreva a ideia com 20 a 2000 caracteres.';
  return { data, errors, valid: Object.keys(errors).length === 0 };
}

export function requestSummary(data) {
  const result = validateRequest(data);
  if (!result.valid) throw new Error('O pedido contém campos inválidos.');
  return ['FORMA & GRÃO — PEDIDO DE DEMONSTRAÇÃO', 'Negócio fictício. Este documento não foi enviado e não constitui uma encomenda.', '', `Nome: ${result.data.name}`, `Email: ${result.data.email}`, `Serviço: ${serviceNames[result.data.service]}`, '', 'A ideia:', result.data.message].join('\n');
}
