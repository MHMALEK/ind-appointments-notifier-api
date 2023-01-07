import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessengerService } from 'src/messenger/messenger.service';
import { CreateUserDto } from './CreatNewUser.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private messengerService: MessengerService,
  ) {}
  async createNewUser(createUserPayload: CreateUserDto) {
    const existingUser = await this.checkIfUserAlreadyExist(createUserPayload);

    if (existingUser) {
      const updatedUser = await this.updateUser({
        ...createUserPayload,
      });
      return updatedUser;
    }

    // if user using his telegram ID, then it's already verify itself
    const isVerified =
      createUserPayload.telegramId || !createUserPayload.email ? true : false;
    const createdUser = new this.userModel({
      ...createUserPayload,
      isVerified,
    });

    const savedUser = await createdUser.save();
    return savedUser;
  }
  async findUserByTelegramOrEmail({ email, telegramId }) {
    const user = await this.userModel.findOne({
      $or: [{ email }, { telegramId }],
    });
    return user;
  }

  async findUserById(userId: string) {
    const user = await this.userModel.findOne({ id: userId });
    return user;
  }

  async updateUser({ email, telegramId }) {
    const user = await this.userModel.findOneAndUpdate(
      {
        $or: [{ email }, { telegramId }],
      },
      {
        email,
        telegramId,
      },
    );
    return user;
  }

  async removeUser({ email, telegramId }) {
    const user = await this.userModel.findOneAndRemove({
      $or: [{ email }, { telegramId }],
    });
    return user;
  }

  async checkIfUserAlreadyExist({ telegramId, email }) {
    const user = await this.findUserByTelegramOrEmail({ telegramId, email });
    if (user) {
      return true;
    }
    return false;
  }
  async getUsersList() {
    const users = await this.userModel.find();
  }

  sendVerificationEmail = (user) => {
    this.messengerService.sendVerificationEmail(user);
  };

  async verifyUserEmail(userId: string) {
    try {
      await this.userModel.findOneAndUpdate(
        {
          id: userId,
        },
        {
          isVerified: true,
        },
      );
      const user = await this.findUserById(userId);
      return user;
    } catch (e) {
      return null;
    }
  }
}
