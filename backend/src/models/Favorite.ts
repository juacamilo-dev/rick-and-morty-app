import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Character } from './Character';

export interface FavoriteAttributes {
  id: number;
  characterId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type FavoriteCreationAttributes = Optional<FavoriteAttributes, 'id'>;

export class Favorite
  extends Model<FavoriteAttributes, FavoriteCreationAttributes>
  implements FavoriteAttributes
{
  public id!: number;
  public characterId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Favorite.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    characterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: Character,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'favorites',
    timestamps: true,
  }
);

Character.hasOne(Favorite, { foreignKey: 'characterId', as: 'favorite' });
Favorite.belongsTo(Character, { foreignKey: 'characterId', as: 'character' });
