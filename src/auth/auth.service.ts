import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt'
import { User } from '@prisma/client';
import { UserPayload } from './models/userPayload';
import { JwtService } from '@nestjs/jwt';
import { userToken } from './models/UserToken';


@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService) { }

    login(user: User): userToken {
        const payload: UserPayload = {
            sub: user.id,
            email: user.email,
            name: user.name
        }

        const jwtToken = this.jwtService.sign(payload)

        return {
            acess_token: jwtToken
        }

    }

    async validateUser(email: string, password: string) {

        const user = await this.userService.findByEmail('andretipoltlopes@gmail.com')

        if (user) {

            const isPasswordValid = await bcrypt.compare(password, user.password)
            if (isPasswordValid) {
                return {
                    ...user,
                    password: undefined
                }
            }
        }
        throw new Error('Email Adress or Password provided is incorrect')
    }
}
