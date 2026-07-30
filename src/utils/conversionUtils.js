import { materialFactors } from '../data/materialFactors.js';

const getFactorAsync = async (materialId) => {
  await new Promise((resolve) => setTimeout(resolve, 50));
  
  const material = materialFactors.find((m) => m.id === materialId);
  
  if (!material || !material.density || material.density <= 0) {
    throw new Error(`Fator de conversão inválido ou inexistente para o material: ${materialId}`);
  }
  return material.density;
};

/**
 * Converte m³ para Toneladas.
 * @returns {Promise<number>} - Peso em Toneladas (arredondado para 3 casas).
 */
export const convertM3ToTons = async (cubicMeters, materialId) => {
  const density = await getFactorAsync(materialId);
  const result = cubicMeters * density;
  return parseFloat(result.toFixed(3));
};

/**
 * Converte Toneladas para m³.
 * @returns {Promise<number>} - Volume em m³ (arredondado para 3 casas).
 */
export const convertTonsToM3 = async (tons, materialId) => {
  const density = await getFactorAsync(materialId);
  const result = tons / density;
  return parseFloat(result.toFixed(3));
};
