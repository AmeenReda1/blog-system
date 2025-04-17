import { AbstractEntity } from "src/common/abstract/abstract.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Blog } from "src/modules/blog/entities/blog.entity";
export enum UserType {
    ADMIN = 'admin',
    EDITOR = 'editor',
}

@Entity()
export class User extends AbstractEntity {

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    mobileNumber: string;

    @OneToMany(() => Blog, (blog) => blog.author)
    blogs: Blog[];

    @Column({ type: 'enum', enum: UserType, default: UserType.EDITOR })
    userType: UserType;
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
    }


}
