const db = require('../db/db');
const axios = require('axios');

async function RegisterUser (req, res) {
    const { name, password, email, cnpj, tel, address, number, bairro, city, profileImage, isPremium, pix } = req.body;


    await db.User.create({
        name: name,
        email: email,
        password: password,
        cnpj: cnpj,
        tel: tel,
        address: address,
        number: number,
        bairro: bairro,
        city: city,
        isPremium: isPremium,
        profileImage: profileImage,
        pix: pix
    });

    console.log(isPremium);
    const accessToken = "APP_USR-2080807952283773-102212-91ec1758a6a040fa6fd4c2b16ae84caf-182889367";


    if ( isPremium === true ) {
        const subscriptionPlan = {
            reason: 'Assinatura plano premium loja',
            auto_recurring: {
                frequency: 1,
                frequency_type: 'months',
                transaction_amount: 14.90,
                currency_id: 'BRL',
                start_date: new Date().toISOString(),
                end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(), // Validade de 1 ano
                repetitions: 12, // 12 meses
                external_reference: 'subscription-external-ref', // Opcional
            },
            back_url: 'https://www.yourbackend.com',
            payer_email: 'gabrield3vsilva@gmail.com' // Email do assinante passado na requisição
        };
    
        try {
            const subscriptionResponse = await axios.post('https://api.mercadopago.com/preapproval', subscriptionPlan, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
    
            console.log(subscriptionResponse.data);
            return res.send(subscriptionResponse.data.init_point);
        } catch (error) {
            console.error(error.response ? error.response.data : error.message);
            if (!res.headersSent) {
                return res.status(500).json({ error: 'Erro ao criar a assinatura' });
            }
        }
    }

    // Criando um plano

    return res.send('/');
}

module.exports = {
    RegisterUser
}