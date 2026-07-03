import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface CharacterAttributes {
  id: number;
  externalId: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  origin: string;
  image: string;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type CharacterCreationAttributes = Optional<CharacterAttributes, 'id' | 'isDeleted'>;

export class Character
  extends Model<CharacterAttributes, CharacterCreationAttributes>
  implements CharacterAttributes
{
  public id!: number;
  public externalId!: number;
  public name!: string;
  public status!: string;
  public species!: string;
  public gender!: string;
  public origin!: string;
  public image!: string;
  public isDeleted!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Character.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    externalId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      comment: 'ID original del personaje en la API de Rick and Morty',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    species: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'characters',
    timestamps: true,
  }
);
