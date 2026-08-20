const express = require('express');
const fs = require('fs');

const app = express();
const arquivo = 'dados.json';

app.use(express.json());

function lerDados() {
    try {
        const dados = JSON.parse(fs.readFileSync(arquivo, 'utf8'));
        return Array.isArray(dados) ? dados : [];
    } catch (error) {
        return [];
    }
}

function salvarDados(itens) {
    fs.writeFileSync(arquivo, JSON.stringify(itens, null, 2));
}

app.get('/itens', (req, res) => {
    res.json(lerDados());
});

app.get('/itens/:id', (req, res) => {
    const id = Number(req.params.id);
    const itens = lerDados();
    const item = itens.find((elemento) => elemento.id === id);

    if (!item) {
        return res.status(404).json({ mensagem: 'Item não encontrado' });
    }

    return res.json(item);
});

app.post('/itens', (req, res) => {
    const itens = lerDados();
    const novo = { id: Date.now(), ...req.body };
    itens.push(novo);
    salvarDados(itens);
    res.status(201).json(novo);
});

app.put('/itens/:id', (req, res) => {
    const id = Number(req.params.id);
    const itens = lerDados();
    const index = itens.findIndex((elemento) => elemento.id === id);

    if (index === -1) {
        return res.status(404).json({ mensagem: 'Item não encontrado' });
    }

    const itemAtualizado = { ...itens[index], ...req.body, id };
    itens[index] = itemAtualizado;
    salvarDados(itens);

    return res.json(itemAtualizado);
});

app.delete('/itens/:id', (req, res) => {
    const id = Number(req.params.id);
    const itens = lerDados();
    const index = itens.findIndex((elemento) => elemento.id === id);

    if (index === -1) {
        return res.status(404).json({ mensagem: 'Item não encontrado' });
    }

    const [itemRemovido] = itens.splice(index, 1);
    salvarDados(itens);

    return res.json({ mensagem: 'Item removido com sucesso', item: itemRemovido });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});