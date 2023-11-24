const express = require('express');

const main = async () => {
    const app = express();

    app.post(
        '/',
        async (req, res) => {
            const author = req.body;

            try {
                const newPost = await Blog.create(author);
                console.log('Objeto salvo com sucesso');
                res.json(newPost);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        }
    );

    app.get(
        '/:author',
        async (req, res) => {
            const nome = req.params.author;
            
            try {
                const docs = await Blog.find({ author: nome });
                res.json(docs);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        }
    );

    app.get(
        '/',
        async (req, res) => {
            try {
                const docs = await Blog.find();
                res.status(200).json(docs);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        }
    );

    app.put(
        '/:id',
        async (req, res) => {
            const id = req.params.id;
            const n_author = req.body;
            try {
                const updatedPost = await Blog.findByIdAndUpdate(
                    id, 
                    { title: n_author.title, author: n_author.author },
                    { new: true }
                );
                console.log('Objeto atualizado:', updatedPost);
                res.json(updatedPost);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        }
    );
}



main().catch(err => console.log(err));