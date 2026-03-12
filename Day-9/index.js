const express = require('express');
const mongoose = require('mongoose');
const app = express();

const PORT = 5000;

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://jalakapalan:Jalak2007@cluster0.dqhwnjd.mongodb.net/Day-9')
    .then(() => {
        console.log('✅ Connected to MongoDB');
    })
    .catch((err) => {
        console.error('❌ Error connecting to MongoDB', err);
    });

// Schema
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    }
});

const Product = mongoose.model('Product', productSchema);

// POST route - create product
app.post('/products', async (req, res) => {
    try {
        const { title, price, category, brand } = req.body;

        const newProduct = new Product({
            title,
            price,
            category,
            brand
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        console.error('Error creating product', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET route - all products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        category:category,
        brand:brand
        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found' });
        }

        res.status(200).json({ products });
    } catch (error) {
        console.error('Error fetching products', error);
        res.status(500).json({ message: 'Internal server error' });
    }

});

// GET route - single product by ID
app.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ product });
    } catch (error) {
        console.error('Error fetching product', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});