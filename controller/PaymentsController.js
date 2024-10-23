const db = require('../db/db');
const axios = require('axios');
const crypto = require('crypto');
const uuid = require('uuid');
const idempotencyKey = uuid.v4();


async function handlePayment ( req, res ) {
    const { item, payer } = req.body;
    const tel = item.tel;
    console.log(item);
    const user = await db.User.findOne({tel: tel});
    receiverPixKey = user.pix;
    const accessToken =  'APP_USR-2080807952283773-102212-91ec1758a6a040fa6fd4c2b16ae84caf-182889367';

    const pixKeyType = determinePixKeyType(receiverPixKey);
    console.log(pixKeyType);
    const paymentDetails = {
        transaction_amount: Number(item.price),
        description: 'Pagamento',
        payment_method_id: 'pix',
        payer: {
            email: 'payer_email@example.com'
        },
        metadata: {
            pix_key: receiverPixKey,
            pix_key_type: pixKeyType
        },
        external_reference: 'payment-external-ref',
        callback_url: 'https://sp-items.onrender.com/notifications' // URL para notificações de pagamento
    };
    
    try {
        const paymentResponse = await axios.post('https://api.mercadopago.com/v1/payments', paymentDetails, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'X-Idempotency-Key': idempotencyKey
            }
        });
        return res.send(paymentResponse.data.point_of_interaction.transaction_data.ticket_url);
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        if (!res.headersSent) {
            return res.status(500).json({ error: 'Erro ao processar o pagamento' });
        }
    }
    

    
}


const determinePixKeyType = (pixKey) => {
    if (/^\d{11}$/.test(pixKey) && !/^1\d{10}$/.test(pixKey)) {
        return 'CPF'; // Chave do tipo CPF
    } else if (/^\d{14}$/.test(pixKey)) {
        return 'CNPJ'; // Chave do tipo CNPJ
    } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pixKey)) {
        return 'email'; // Chave do tipo e-mail
    } else if (/^\+?\d{1,14}$/.test(pixKey) || /^[1-9]\d{10}$/.test(pixKey)) {
        return 'phone'; // Chave do tipo telefone
    } else {
        throw new Error('Chave PIX inválida');
    }
};



module.exports = {handlePayment}