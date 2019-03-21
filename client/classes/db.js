const axios = require('axios');

class Field {
  constructor(name, type, defaultValue, constraint, nullable) {
    this.name = name;
    this.type = type;
    this.default = defaultValue;
    this.constraint = constraint;
    this.nullable = nullable;
  }
}

class Table {
  constructor(name, fields) {
    this.name = name;
    this.fields = fields;
  }

  toString() {
    return this.name;
  }
}

export default class Db {
  constructor(tables) {
    this.tables = tables;
  }

  getTableNames = () => {
    return this.tables.map(table => table.toString());
  };

  isTableInDb = tableName => {
    return this.getTableNames().includes(tableName);
  };

  getTable = tableName => {
    return this.tables.find(table => table.toString() === tableName);
  };

  static async build() {
    const res = await axios.get('/api/queries/getDbMetadata');
    const db = res.data;

    const tables = db.tables.map(table => {
      const fields = table.fields.map(
        field =>
          new Field(
            field.name,
            field.type,
            field.default,
            field.constraint,
            field.nullable
          )
      );
      return new Table(table.name, fields);
    });

    return new Db(tables);
  }
}