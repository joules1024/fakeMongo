import { FakeModel } from "../lib/fakeMongoose.js";

// "usuarios" → se guardará en /server/database/Autolab/usuarios.json
export const User = new FakeModel("usuarios");
