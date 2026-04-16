import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import sequelize from "../config/database";

export interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: "admin" | "manager" | "worker";
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

type UserCreationAttributes = Optional<UserAttributes, "id" | "is_active">;

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: string;
  public name!: string;
  public email!: string;
  public password_hash!: string;
  public role!: "admin" | "manager" | "worker";
  public is_active!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Helper: strip password_hash before returning to client
  toSafeJSON(): Omit<UserAttributes, "password_hash"> {
    const { password_hash, ...safe } = this.toJSON() as UserAttributes;
    return safe;
  }
}
export function initUserModel(sequelize: Sequelize): void {User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "manager", "worker"),
      allowNull: false,
      defaultValue: "worker",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "users",
    underscored: true, 
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);}


export default User;
