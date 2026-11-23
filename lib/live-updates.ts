import { EventEmitter } from 'node:events';

// Canal en memoria entre /api/revalidate (Thaya avisa un cambio) y /api/live
// (las páginas abiertas escuchan). Vive en globalThis para que el recargado en
// caliente de desarrollo no cree un canal nuevo por módulo.
//
// Funciona con un solo servidor Node (next start o next dev). Con varias
// instancias o serverless, cada una tendría su canal y el aviso llegaría solo
// a las páginas conectadas a la que recibió el webhook.
const globalForLive = globalThis as unknown as { storefrontLive?: EventEmitter };

export const storefrontLive = globalForLive.storefrontLive ?? new EventEmitter();
storefrontLive.setMaxListeners(0);
globalForLive.storefrontLive = storefrontLive;

export const CATALOG_CHANGED = 'catalog-changed';
