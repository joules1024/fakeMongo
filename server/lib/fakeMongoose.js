import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

export class FakeModel {
  constructor(collectionName) {
    this.basePath = path.join(process.cwd(), "database", "Autolab");
    if (!fs.existsSync(this.basePath)) fs.mkdirSync(this.basePath, { recursive: true });

    this.filePath = path.join(this.basePath, `${collectionName}.json`);
    if (!fs.existsSync(this.filePath)) fs.writeFileSync(this.filePath, "[]");
  }

  _readFile() {
    return JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
  }

  _writeFile(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  async find(query = {}) {
    const data = this._readFile();
    return data.filter(u => Object.entries(query).every(([k,v]) => u[k] === v));
  }

  async findOne(query = {}) {
    const all = await this.find(query);
    return all[0] || null;
  }

  async findById(id) {
    const data = this._readFile();
    return data.find(u => u._id === id) || null;
  }

  async save(doc) {
    const data = this._readFile();
    const newDoc = { ...doc, _id: randomUUID(), createdAt: new Date(), updatedAt: new Date() };
    data.push(newDoc);
    this._writeFile(data);
    return newDoc;
  }

  async findByIdAndUpdate(id, update, opts = { new: true }) {
    const data = this._readFile();
    const idx = data.findIndex(u => u._id === id);
    if (idx === -1) return null;

    data[idx] = { ...data[idx], ...update, updatedAt: new Date() };
    this._writeFile(data);
    return opts.new ? data[idx] : null;
  }

  async findByIdAndDelete(id) {
    const data = this._readFile();
    const idx = data.findIndex(u => u._id === id);
    if (idx === -1) return null;

    const deleted = data[idx];
    data.splice(idx, 1);
    this._writeFile(data);
    return deleted;
  }
}
