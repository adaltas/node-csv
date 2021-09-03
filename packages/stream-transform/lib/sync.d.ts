/// <reference types="node" />

import {Options} from './index';

export type Handler<T = any, U = any> = (record: T) => U
export function transform<T = any, U = any>(records: Array<T>, handler: Handler<T, U>): Array<U>
export function transform<T = any, U = any>(records: Array<T>, options: Options, handler: Handler<T, U>): Array<U>

export default transform;
