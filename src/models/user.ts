import { model, Schema, Document, Model, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';
import NotAuthError from '../errors/NotAuthError';

export interface IUser extends Document {
  name: string;
  about: string;
  avatar: string;
  email: String;
  password: string;
}
interface UserModel extends Model<IUser> {
  findUserByCredentials: (
    email: string,
    password: string
  ) => Promise<Document<unknown, any, IUser>>;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (link: string) => {
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/.test(
          link,
        );
      },
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: Schema.Types.Mixed) => validator.isEmail(value as unknown as string),
      message: 'Incorrect type of email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});
userSchema.static(
  'findUserByCredentials',
  async function findUserByCredentials(
    email: string,
    password: string,
  ) {
    const user: (Document<unknown, any, IUser> & Omit<IUser & { _id: Types.ObjectId }, never>) | null = await this.findOne({ email }).select('+password');
    if (!user) {
      throw new NotAuthError('Неправильная почта');
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new NotAuthError('Неправильный пароль');
    }
    return user;
  },
);
export default model<IUser, UserModel>('user', userSchema);
