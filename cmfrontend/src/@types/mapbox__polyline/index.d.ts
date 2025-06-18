// src/@types/@mapbox__polyline/index.d.ts
declare module '@mapbox/polyline' {
  /**
   * Decodifica uma string polyline em um array de [lat, lon].
   * @param encoded String codificada
   * @param precision Número de casas decimais (padrão 5)
   */
  export function decode(encoded: string, precision?: number): Array<[number, number]>;

  /**
   * Codifica um array de coordenadas em uma string polyline.
   * @param coords Array de [lat, lon]
   * @param precision Número de casas decimais (padrão 5)
   */
  export function encode(coords: Array<[number, number]>, precision?: number): string;

  const polyline: {
    decode: typeof decode;
    encode: typeof encode;
  };
  export default polyline;
}
