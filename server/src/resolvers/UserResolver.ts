/* eslint-disable */
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  FieldResolver,
  Root,
} from 'type-graphql';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import NewUser from '../inputs/NewUser.input';
import UpdateUser from '../inputs/UpdateUser.input';
import Sport from '../models/sport.model';
import LoginResponse from '../auth/LoginResponse';

@Resolver(User)
export default class UserResolver {
  @Query(() => [User])
  async getAllUsers() {
    try {
      return User.findAll({ order: [['ID', 'ASC']], include: [Sport] });
    } catch (err) {
      console.error(err);
    }
  }

  @Query(() => User)
  async getOneUser(@Arg('ID') ID: number) {
    try {
      const user = await User.findOne({ where: { ID } });
      if (!user) throw new Error('User not found!');
      return user;
    } catch (err) {
      console.error(err);
    }
  }

  @Query(() => LoginResponse)
  async loginUser(@Arg('email') email: string, @Arg('passW') passW: string) {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) throw new Error('User not found!');
      const isValidPassW = await bcrypt.compare(passW, user.passW);
      if (!isValidPassW) throw new Error('Invalid password!');
      return {
        accessToken: jwt.sign({ userId: user.id }, 'JWTSecretKey', { expiresIn: '60m' }),
        user,
      };
    } catch (err) {
      console.error(err);
    }
  }

  @Mutation(() => LoginResponse)
  async newUser(@Arg('userData') userData: NewUser) {
    try {
      const { passW } = userData;
      const pswdHash = await bcrypt.hash(passW, 10);
      userData.passW = pswdHash;
      const user = await User.create(userData);
      userData.favSports && (await user.$set('favSports', userData.favSports));
      return {
        accessToken: jwt.sign({ userId: user.id }, 'JWTSecretKey', { expiresIn: '60m' }),
        user,
      };
    } catch (err) {
      console.error(err);
    }
  }

  @Mutation(() => User)
  async updateUser(@Arg('ID') id: number, @Arg('userData') userData: UpdateUser) {
    try {
      const user = await User.findOne({ where: { ID: id } });
      if (!user) throw new Error('User not found!');
      if (userData.passW) {
        const { passW } = userData;
        const pswdHash = await bcrypt.hash(passW, 10);
        userData.passW = pswdHash;
      }
      /*
       *  if(userData.friends && userData.friends.length){
       *   const result = await user.$add('friends', userData.friends);
       *   console.log('result' , result)
       *    delete userData.friends
       *  }
       */
      await user.update(userData);
      userData.favSports && (await user.$set('favSports', userData.favSports));
      return user;
    } catch (err) {
      console.error(err);
    }
  }

  @Mutation(() => User)
  async deleteUser(@Arg('ID') id: number) {
    try {
      const user = await User.findOne({ where: { ID: id } });
      if (!user) throw new Error('User not found!');
      return user.destroy();
    } catch (err) {
      console.error(err);
    }
  }

  @FieldResolver()
  async favSports(@Root() user: User) {
    console.log(user);
    return user.favSports || user.$get('favSports');
  }

  /*
   *  @FieldResolver()
   *  friends(@Root() user: User) {
   *    return user.friends || user.$get('friends');
   *  }
   */
}
