import { AbstractEntity } from "src/common/abstract/abstract.entity";
import { User } from "src/modules/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from "typeorm";
import { Blog } from "./blog.entity";

@Entity()
export class Tag extends AbstractEntity {
    @Column()
    name: string;

    @ManyToMany(() => Blog, (blog) => blog.tags)
    blogs: Blog[];

}
