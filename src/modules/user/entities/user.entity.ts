import * as bcrypt from 'bcrypt';

import { AbstractEntity } from "src/common/abstract/abstract.entity";
import { Blog } from "src/modules/blog/entities/blog.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from "typeorm";

export enum UserType {
    ADMIN = 'admin',
    EDITOR = 'editor'
}
@Entity()
export class User extends AbstractEntity{
    @Column({ unique: true })
    email: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: UserType,
        default: UserType.EDITOR
    })
    userType: UserType;

    @Column({ unique: true })
    mobileNumber: string;

    @OneToMany(() => Blog, (blog) => blog.author)
    blogs: Blog[];
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            const saltRounds = bcrypt.genSaltSync();
            this.password = bcrypt.hashSync(this.password, saltRounds);
        }
    }
}
