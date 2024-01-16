import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";

import { UserEntity } from '../../domain/entities/user.entity';
import { BlackList, UserModel } from "../../domain/models";

export class SessionMiddleware {

    constructor() {}

    static async validateJwt(req: Request, res: Response, next: NextFunction) {

        const authorization = req.header('Authorization');

        if( !authorization ) return res.status(401).json({ error: 'Token no proveído' });
        if( !authorization.startsWith('Bearer ')) return res.status(401).json({ error: 'Invalid Bearer token'});

        const token = authorization.split(' ').at(1) || '';

        try {
            const expired = await BlackList.findOne({ where: { token } });
            if( expired ) return res.status(401).json({ error: 'Token expired' }); 

            const payload = await JwtAdapter.validateToken<{ id: number }>( token );
            if( !payload ) return res.status(401).json({ error: 'Invalid token' });

            const user = await UserModel.findOne({ where: { id: payload.id }});
            if( !user ) return res.status(401).json({ error: 'Error token validation information.'});

            const { password, ...userEntity } = UserEntity.fromObject( user );
            req.body.user = userEntity;

            next();
        } catch (error) {
            console.error( error );
            return res.status(500).json({ error: 'Internal server error.'});
        }
    }

}