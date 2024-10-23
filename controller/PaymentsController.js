const db = require('../db/db');
const axios = require('axios');
const crypto = require('crypto');
const uuid = require('uuid');
const idempotencyKey = uuid.v4();


async function handlePayment ( req, res ) {
    const { item, payer } = req.body;
    const tel = item.tel;

    const user = await db.User.findOne({tel: tel});

    console.log(user);
    receiverPixKey = user.pix;


    const accessToken =  'TEST-7743467509384373-070619-13a5870da1c1e6170016d55946eb83fd-1840600103';

    const pixKeyType = determinePixKeyType(receiverPixKey);
    console.log(pixKeyType);
    const paymentDetails = {
        transaction_amount: 14.90,
        description: 'Pagamento padrão entre usuários',
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
    
        console.log(paymentResponse.data);
        //return res.send(paymentResponse.data);
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