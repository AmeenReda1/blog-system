import { AbstractEntity } from "src/common/abstract/abstract.entity";
import { User } from "src/modules/user/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import { Tag } from "./tag.entity";

@Entity()
export class Blog extends AbstractEntity {
    @Column()
    title: string;

    @Column('text')
    content: string;

    @ManyToMany(() => Tag, tag => tag.blogs)
    @JoinTable({
        name: 'blog_tags',
        joinColumn: {
            name: 'blog_id',     
            referencedColumnName: 'id' 
        },
        inverseJoinColumn: {
            name: 'tag_id',   
            referencedColumnName: 'id' 
        }
    })
    tags: Tag[];
        
    @ManyToOne(() => User, (user) => user.blogs, { eager: false })
    @JoinColumn({ name: 'author_id' })
    author: User;

    @Column({ name: 'author_id' }) // Explicitly define the column name
    author_id: number;
}
