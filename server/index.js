const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({
  dest: path.join(__dirname, 'uploads'),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

app.post('/api/doctors', upload.single('image'), (req, res) => {
  console.log('file:', req.file);
  console.log('body:', req.body);
  // TODO: validate/save DB
  res.json({ success: true, body: req.body, file: req.file });
});

const PORT = process.env.PORT || 9090;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));