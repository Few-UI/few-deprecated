/* eslint-env jest */

import { patchData } from '../src/store';

describe( 'Test patchData', () => {
    it( 'Test patchData with patch = {}', () => {
        const data = { a: 1 };
        expect( patchData( {}, data ) ).toStrictEqual( { a: 1 } );
    } );

    it( 'Test patchData with patch = { path: undefined } (unchanged)', () => {
        const data = { a: { a1: 3 } };
        expect( patchData( { b: undefined }, data ) ).toStrictEqual( { a: { a1: 3 } } );
    } );

    it( 'Test patchData with patch = { path: undefined } (changed)', () => {
        const data = { a: { a1: 3 } };
        expect( patchData( { a: undefined }, data ) ).toStrictEqual( {} );
    } );

    it( 'Test patchData with patch = { path: primitive } (changed)', () => {
        const data = { a: 1 };
        expect( patchData( { a: 2 }, data ) ).toStrictEqual( { a: 2 } );
    } );

    it( 'Test patchData with patch = { path: primitive } (added)', () => {
        const data = { b: 1 };
        expect( patchData( { a: 2 }, data ) ).toStrictEqual( { a: 2, b: 1 } );
    } );

    it( 'Test patchData with patch = { path: object } (changed)', () => {
        const data = { a: { c: 2 }, d: 4 };
        expect( patchData( { a: { b: 3 } }, data ) ).toStrictEqual( { a: { b: 3 }, d: 4 } );
    } );

    it( 'Test patchData with patch = { path: object } (added)', () => {
        const data = { a: { c: 2 } };
        expect( patchData( { b: { d: 3 } }, data ) ).toStrictEqual( { a: { c: 2 }, b: { d: 3 } } );
    } );

    it( 'Test patchData with patch = { path.subpath: undefined } (unchanged)', () => {
        const data = { a: { a1: 3 } };
        expect( patchData( { 'a.b1': undefined }, data ) ).toStrictEqual( { a: { a1: 3 } } );
    } );

    it( 'Test patchData with patch = { path.subpath: undefined } (changed)', () => {
        const data = { a: { a1: 3 } };
        expect( patchData( { 'a.a1': undefined }, data ) ).toStrictEqual( { a: {} } );
    } );

    it( 'Test patchData with patch = { path.subpath: primitive } (changed)', () => {
        const data = { a: { a1: 3 } };
        expect( patchData( { 'a.a1': 2 }, data ) ).toStrictEqual( { a: { a1: 2 } } );
    } );

    it( 'Test patchData with patch = { path.subpath: primitive } (added)', () => {
        const data = { a: { a1: 3 } };
        expect( patchData( { 'a.a2': 4, 'b.b1.b2': 5 }, data ) ).toStrictEqual( { a: { a1: 3, a2: 4 }, b: { b1: { b2: 5 } } } );
    } );

    it( 'Test patchData with patch = { path.subpath: object } (changed)', () => {
        const data = { a: { a1: 3 } };
        expect( patchData( { 'a.a1': { a11: 3 } }, data ) ).toStrictEqual( { a: { a1: { a11: 3 } } } );
    } );
} );
