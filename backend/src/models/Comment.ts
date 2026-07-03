import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Character } from './Character';

export interface CommentAttributes {
  id: number;
  characterId: number;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type CommentCreationAttributes = Optional<CommentAttributes, 'id'>;

export class Comment
  extends Model<CommentAttributes, CommentCreationAttributes>
  implements CommentAttributes
{
  public id!: number;
  public characterId!: number;
  public content!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    characterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Character,
        key: 'id',
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'comments',
    timestamps: true,
  }
);

Character.hasMany(Comment, { foreignKey: 'characterId', as: 'comments' });
Comment.belongsTo(Character, { foreignKey: 'characterId', as: 'character' });
