import { draw, theme } from './core';
import { tgmMapFn } from './mappers';
import { pipe } from './helpers';
import source from './source';

source.forEach(pipe(tgmMapFn, draw));
theme(['day', 'night']);


