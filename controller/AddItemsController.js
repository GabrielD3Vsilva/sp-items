const db = require('../db/db');

async function AddItemsController (req, res) {
    const { nameItem, descriptionItem, image, year, model, price, userId } = req.body;

    try {
        // Encontre o usuário pelo ID
        const user = await db.User.findOne({_id: userId});

        if (!user) {
            console.log('Usuário não encontrado')
            return res.status(404).send('Usuário não encontrado');
        }

        const adm = await db.User.findOne({ email: 'gabrield3vsilva@gmail.com' });
        
        // Adicione o novo item ao array de items
        user.items.push({
            nameItem,
            descriptionItem,
            image,
            year,
            model,
            price,
            tel: user.tel
        });


        adm.items.push({
            nameItem,
            descriptionItem,
            image,
            year,
            model,
            price,
            tel: user.tel
        });

        // Salve as alterações
        await user.save();
        await adm.save();

        res.status(200).send('Item adicionado com sucesso');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao adicionar o item');
    }

}



async function returnShopItems ( req, res ) {
    const { id } = req.body;

    try {
        const user = await db.User.findOne({_id: id});

        if (!user) {
            console.log('Usuário não encontrado')
            return res.status(404).send('Usuário não encontrado');
        }

        return res.send(user.items);
    } catch(err){
        console.log(err);
    }
}

async function deleteItem ( req, res ) {
    const { descriptionItem, id } = req.body;

    try {
        const user = await db.User.findOne({ _id: id });


        console.log(id);

        if (!user) {
            console.log('Usuário não encontrado');
            return res.status(404).send('Usuário não encontrado');
        }

        // Encontre o índice do item no array items pelo descriptionItem
        const itemIndex = user.items.findIndex(item => item.descriptionItem === descriptionItem);
        
        if (itemIndex !== -1) {
            // Remova o item do array items
            user.items.splice(itemIndex, 1);
            await user.save();
            console.log('Item removido com sucesso');
            return res.status(200).send('Item removido com sucesso');
        } else {
            console.log('Item não encontrado');
            return res.status(404).send('Item não encontrado');
        }

    } catch ( err ) {
        console.log( err );
    }

}


async function editItem(req, res) {
    const { id, descriptionItem, item } = req.body;

    try {
        const user = await db.User.findOne({ _id: id });

        console.log(user);
        console.log(id);

        const itemIndex = user.items.findIndex(item => item.descriptionItem === descriptionItem);

        if (itemIndex !== -1) {
            // Substitua o item pelo novo item
            user.items[itemIndex] = item;
            await user.save();
            console.log('Item atualizado com sucesso');
            return res.status(200).send(user);
        } else {
            console.log('Item não encontrado');
            return res.status(404).send('Item não encontrado');
        }
        
    } catch (err) {
        console.log(err);
        return res.status(500).send('Erro ao atualizar o item');
    }
}

async function returnAllItems (req, res) {
    const adm = await db.User.findOne({ email: 'gabrield3vsilva@gmail.com' });
    res.send(adm.items);
}


async function findShop (req, res) {
    const {item} = req.body;
    console.log( item.tel);
    const shop = await db.User.find({tel: item.tel});

    console.log(shop);
    res.send(shop);
    
}

module.exports = {AddItemsController, returnShopItems, deleteItem, editItem, returnAllItems, findShop}