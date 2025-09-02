import express from 'express';

let User;

if (process.env.USE_FAKE_DB === "true") {
  console.log("⚠️ Usando base de datos FAKE (archivo JSON en disco)");
  const fakeModule = await import('../models/User.fake.js');
  User = fakeModule.User;
} else {
  console.log("✅ Usando base de datos MongoDB real");
  const mongoModule = await import('../models/User.js');
  User = mongoModule.User;
}

const router = express.Router();

// Crear usuario
router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya existe' });
    }

    let user;
    if (process.env.USE_FAKE_DB === "true") {
      user = await User.save({ name, email, password });
    } else {
      user = new User({ name, email, password });
      await user.save();
    }

    const { password: _, ...userResponse } =
      process.env.USE_FAKE_DB === "true" ? user : user.toObject();

    res.status(201).json(userResponse);
  } catch (err) {
    console.error('💥 Error en POST /api/users:', err);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// Listar usuarios
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    const cleanUsers = users.map(u => {
      const { password, ...rest } = u;
      return rest;
    });
    res.json(cleanUsers);
  } catch (err) {
    console.error('💥 Error en GET /api/users:', err);
    res.status(500).json({ error: 'Error al listar usuarios' });
  }
});

// Obtener usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const { password, ...rest } = user;
    res.json(rest);
  } catch (err) {
    console.error('💥 Error en GET /api/users/:id:', err);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// Actualizar usuario
router.put('/:id', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Nombre y email son obligatorios' });
    }

    const updateData = { name, email };
    if (password) updateData.password = password;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const { password: _, ...rest } = user;
    res.json(rest);
  } catch (err) {
    console.error('💥 Error en PUT /api/users/:id:', err);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// Eliminar usuario
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error('💥 Error en DELETE /api/users/:id:', err);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

export default router;
