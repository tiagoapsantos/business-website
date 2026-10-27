import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateRequest, requestSummary, serviceNames } from '../src/assets/validation.js';
const valid = {name:'Alex Demonstração',email:'alex@example.com',service:'mobiliario',message:'Uma estante para um espaço de demonstração.'};
test('campos vazios produzem quatro erros e impedem o resumo',()=>{
  assert.equal(Object.keys(validateRequest({}).errors).length,4);
  assert.throws(()=>requestSummary({}));
});
test('valida limites, espaços, emails e serviços desconhecidos',()=>{
  for(const name of [' ','x','x'.repeat(81)]) assert.ok(validateRequest({...valid,name}).errors.name);
  for(const email of ['x','a@b','a b@example.com','x@x@x.com','x'.repeat(250)+'@a.com']) assert.ok(validateRequest({...valid,email}).errors.email);
  for(const service of ['','unknown','constructor','__proto__']) assert.ok(validateRequest({...valid,service}).errors.service);
  for(const message of [' ','x'.repeat(19),'x'.repeat(2001)]) assert.ok(validateRequest({...valid,message}).errors.message);
});
test('aceita limites válidos e todos os serviços definidos',()=>{
  for(const service of Object.keys(serviceNames)) assert.equal(validateRequest({...valid,service}).valid,true);
  for(const name of ['Ab','x'.repeat(80)]) assert.equal(validateRequest({...valid,name}).valid,true);
  for(const message of ['x'.repeat(20),'x'.repeat(2000)]) assert.equal(validateRequest({...valid,message}).valid,true);
});
test('normaliza espaços sem modificar o objecto original',()=>{
  const input={...valid,name:'  Alex Demonstração  '};const result=validateRequest(input);
  assert.equal(result.data.name,'Alex Demonstração');assert.equal(input.name,'  Alex Demonstração  ');
});
test('resumo preserva Unicode e identifica ausência de envio',()=>{
  const text=requestSummary(valid);assert.match(text,/Alex Demonstração/);assert.match(text,/Mobiliário por medida/);assert.match(text,/não foi enviado/);
});
