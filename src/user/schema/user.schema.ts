import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import { AuthProvider } from '../enum/userProvider.enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @ApiProperty()
  @Prop({
    required: true,
  })
  firstName: string;

  @ApiProperty()
  @Prop({
    required: true,
  })
  lastName: string;

  @ApiProperty()
  @Prop({
    required: true,
  })
  email: string;

  @Prop()
  password?: string;

  @Prop({
    required: true,
    default: AuthProvider.LOCAL,
    enum: AuthProvider,
  })
  provider: AuthProvider;
}

export const UserSchema = SchemaFactory.createForClass(User);
