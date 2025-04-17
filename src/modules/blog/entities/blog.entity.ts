import { AbstractEntity } from "src/common/abstract/abstract.entity";
import { User } from "src/modules/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class Blog extends AbstractEntity {
    @Column()
    title: string;

    @Column('text')
    content: string;

    @Column('simple-array')
    tags: string[];

    @ManyToOne(() => User, (user) => user.blogs, { eager: false })
    @JoinColumn({ name: 'author_id' })
    author: User;

    @Column({ name: 'author_id' }) // Explicitly define the column name
    author_id: number;
}
