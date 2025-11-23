const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const propertyRoutes = require('../src/routes/propertyRoutes');
const { protect, authorize } = require('../src/middleware/auth');

// Mock auth middleware
jest.mock('../src/middleware/auth', () => ({
    protect: (req, res, next) => {
        req.user = { role: 'admin' };
        next();
    },
    authorize: (...roles) => (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
app.use('/api/properties', propertyRoutes);

// Mock Mongoose models
jest.mock('../src/models/Property', () => {
    return {
        find: jest.fn().mockResolvedValue([{ name: 'Test Property', address: '123 Test St' }]),
        create: jest.fn().mockResolvedValue({ name: 'New Property', address: '456 New St' }),
        findById: jest.fn(),
    };
});

describe('Property API', () => {
    it('GET /api/properties - should return all properties', async () => {
        const res = await request(app).get('/api/properties');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].name).toBe('Test Property');
    });
});
