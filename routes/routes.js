const router = require("express").Router();
const RegisterController = require('../controller/RegisterController');
const LoginController = require('../controller/LoginController');
const AddItemsController = require('../controller/AddItemsController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const xlsx = require('xlsx');
const db = require('../db/db');
const PaymentsController = require('../controller/PaymentsController')

router.post('/register', RegisterController.RegisterUser);
router.post('/login', LoginController.LoginUser);
router.post('/addItem', AddItemsController.AddItemsController);
router.post('/returnShopItems', AddItemsController.returnShopItems);
router.post('/deleteItem', AddItemsController.deleteItem);
router.post('/editItem', AddItemsController.editItem);
router.post('/returnAllItems', AddItemsController.returnAllItems);
router.post('/handlePay', PaymentsController.handlePayment);
router.post('/pay', RegisterController.pay)


router.post('/notifications', async (req, res) => {
  const { action, data } = req.body;
  if ( action === 'payment.updated' && data.status === 'approved' ) {
    console.log('Pagamento aprovado!', data);
  } else {
    console.log('Notificação recebida', data);
  }
  res.status(200).send('OK');
});

router.post('/addItemX', upload.single('file'), async (req, res) => {
    const userId = req.body.userId;
    const file = req.file;
  
    try {
      const user = await db.User.findOne({ _id: userId });
      const adm = await db.User.findOne({ email: 'gabrield3vsilva@gmail.com' });
  
      console.log('Usuário:', user);
      console.log('Admin:', adm);
      console.log('Arquivo:', file);
  
      // Ler e processar o arquivo Excel
      const workbook = xlsx.readFile(file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);
  
      // Exibir os dados no console
      data.forEach((row, index) => {
        console.log(`Linha ${index + 1}:`, row);
        user.items.push({
          nameItem: row.Título,
          descriptionItem: row.Descrição,
          year: row.Ano,
          model: row.Modelo,
          price: row.Preço,
          tel: user.tel
        });
        adm.items.push({
          nameItem: row.Título,
          descriptionItem: row.Descrição,
          year: row.Ano,
          model: row.Modelo,
          price: row.Preço,
          tel: user.tel
        });
      });
  
      await user.save();
      await adm.save();
  
      res.send('Arquivo processado com sucesso');
    } catch (err) {
      console.log(err);
      res.status(500).send('Erro ao processar o arquivo');
    }
  });

module.exports = router;