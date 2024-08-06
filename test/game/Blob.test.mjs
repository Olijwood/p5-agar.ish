import { expect } from 'chai';
import { Blobby } from '../../server/game/Blob.js';

describe('Blobby', () => {
    it('should initialize with the correct properties', () => {
        const id = 'testBlob';
        const x = 50;
        const y = 50;
        const r = 20;
        const blob = new Blobby(id, x, y, r);

        expect(blob.id).to.equal(id);
        expect(blob.x).to.equal(x);
        expect(blob.y).to.equal(y);
        expect(blob.r).to.equal(r);
    });

    it('should grow when it eats food', () => {
        const id = 'testBlob';
        const x = 50;
        const y = 50;
        const r = 20;
        const blob = new Blobby(id, x, y, r);
        const foodR = 5;
        const expectedNewRadius = Math.sqrt((Math.PI * r * r) + (Math.PI * foodR * foodR)) / Math.sqrt(Math.PI);

        blob.eat({ r: foodR });
        expect(blob.r).to.be.closeTo(expectedNewRadius, 0.0001);
    });
});
